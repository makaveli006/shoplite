from django.db import transaction
from django.db.models import F
from django.utils import timezone

from cart.models import Cart
from catalog.models import Product

from .models import Order, OrderItem
from .tasks import ORDER_EMAILS, send_order_email


class OrderStatusError(Exception):
    """A status change was refused (not allowed from the current status)."""


class CheckoutError(Exception):
    """Checkout was refused. `problems` is a list of messages to show the customer."""

    def __init__(self, problems):
        self.problems = problems if isinstance(problems, list) else [problems]
        super().__init__('; '.join(self.problems))


@transaction.atomic
def place_order(user, shipping):
    """Turn the user's cart into an order. All-or-nothing: if anything fails, nothing is saved.

    `shipping` is a dict with full_name, address, city, postal_code, country and optional phone.
    """
    # 1. Lock this user's cart row until the transaction ends. A second checkout from the
    #    same user (double click, two tabs) waits here, then finds an empty cart.
    cart = Cart.objects.select_for_update().filter(user=user).first()
    items = list(cart.items.all()) if cart else []
    if not items:
        raise CheckoutError('Your cart is empty.')

    # 2. Lock the products being bought, always in the same order (by id). Another customer
    #    checking out the same products waits here until we are finished, so two people can
    #    never both buy the last item. Same order everywhere = no two checkouts wait on each other forever.
    locked = Product.objects.select_for_update().filter(id__in=[item.product_id for item in items]).order_by('id')
    products = {product.id: product for product in locked}

    # 3. Re-check availability and stock with the locked, up-to-date numbers.
    problems = []
    for item in items:
        product = products[item.product_id]
        if not product.is_active:
            problems.append(f'"{product.name}" is no longer available. Please remove it from your cart.')
        elif item.quantity > product.stock:
            problems.append(
                f'Only {product.stock} of "{product.name}" in stock, but your cart has {item.quantity}.'
            )
    if problems:
        raise CheckoutError(problems)

    # 4. Create the order with frozen prices (snapshot).
    total = sum((products[item.product_id].price * item.quantity for item in items))
    order = Order.objects.create(user=user, total_amount=total, **shipping)
    OrderItem.objects.bulk_create([
        OrderItem(
            order=order,
            product=products[item.product_id],
            product_name=products[item.product_id].name,
            unit_price=products[item.product_id].price,
            quantity=item.quantity,
        )
        for item in items
    ])

    # 5. Reduce stock inside the database (safe even without our checks; the stock >= 0
    #    database rule is the final safety net).
    now = timezone.now()
    for item in items:
        Product.objects.filter(pk=item.product_id).update(stock=F('stock') - item.quantity, updated_at=now)

    # 6. Empty the cart.
    cart.items.all().delete()
    cart.save(update_fields=['updated_at'])

    # 7. Queue the confirmation email, but only AFTER the order is really saved
    #    (if the transaction rolls back, nothing is queued). robust=True: if the queue
    #    (Redis) is unreachable, log the error instead of failing a checkout that
    #    already succeeded.
    transaction.on_commit(lambda: send_order_email.delay(order.pk, 'confirmation'), robust=True)

    return order


@transaction.atomic
def change_status(order_id, new_status, customer=None):
    """Move an order to a new status, following Order.ALLOWED_TRANSITIONS.

    Cancelling puts the ordered quantities back into stock.
    With `customer` given, this is a customer cancelling their own order: only
    their own orders, and only while the order is still pending.
    """
    # Lock the order row: two clicks on "Cancel" (or an admin and a customer at the
    # same time) are handled one after the other, so stock is never returned twice.
    order = Order.objects.select_for_update().get(pk=order_id)
    labels = dict(Order.Status.choices)

    if customer is not None:
        if order.user_id != customer.pk:
            raise OrderStatusError('This is not your order.')
        if order.status != Order.Status.PENDING:
            raise OrderStatusError(
                f'This order is already {labels[order.status].lower()} and can no longer be cancelled. '
                'Please contact us.'
            )

    if order.status == new_status:
        raise OrderStatusError(f'The order is already {labels[new_status].lower()}.')
    if not order.can_change_status_to(new_status):
        raise OrderStatusError(
            f'An order that is {labels[order.status].lower()} cannot be changed to {labels[new_status].lower()}.'
        )

    if new_status == Order.Status.CANCELLED:
        now = timezone.now()
        for item in order.items.exclude(product=None):
            Product.objects.filter(pk=item.product_id).update(stock=F('stock') + item.quantity, updated_at=now)

    order.status = new_status
    order.save(update_fields=['status', 'updated_at'])

    # Tell the customer, the same way checkout does: queued only after the change is really
    # saved, and a broken queue (Redis down) never undoes a status change that succeeded.
    if new_status in ORDER_EMAILS:
        by_customer = customer is not None
        transaction.on_commit(
            lambda: send_order_email.delay(order.pk, new_status, cancelled_by_customer=by_customer),
            robust=True,
        )
    return order

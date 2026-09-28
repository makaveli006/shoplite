from django.db import transaction
from django.db.models import F
from django.utils import timezone

from cart.models import Cart
from catalog.models import Product

from .models import Order, OrderItem


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

    return order

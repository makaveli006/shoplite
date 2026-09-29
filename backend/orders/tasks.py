from celery import shared_task

from core.emails import InlineImages, send_email

from .emails import order_email_context
from .models import Order

# The emails a customer can get about an order: kind -> (subject, template in templates/emails/).
# Apart from 'confirmation', the kinds are Order.Status values: change_status() sends the email
# of the new status, if there is one here.
ORDER_EMAILS = {
    'confirmation': ('Order #{id} confirmed', 'order_confirmation'),
    Order.Status.PAID: ('Payment received for order #{id}', 'order_paid'),
    Order.Status.SHIPPED: ('Your order #{id} has shipped', 'order_shipped'),
    Order.Status.DELIVERED: ('Your order #{id} was delivered', 'order_delivered'),
    Order.Status.CANCELLED: ('Your order #{id} was cancelled', 'order_cancelled'),
}


@shared_task(
    autoretry_for=(OSError,),  # network / mail server problems: try again later
    retry_backoff=True,  # wait 1s, 2s, 4s ... between attempts
    max_retries=5,
)
def send_order_email(order_id, kind, cancelled_by_customer=False):
    """Email the customer about their order (see ORDER_EMAILS). Runs in the Celery worker.

    cancelled_by_customer only changes the wording of the 'cancelled' email.
    """
    subject, template = ORDER_EMAILS[kind]
    order = Order.objects.select_related('user').prefetch_related('items__product').get(pk=order_id)

    images = InlineImages()
    send_email(
        to=order.user.email,
        subject=subject.format(id=order.pk),
        template=template,
        context={**order_email_context(order, images), 'cancelled_by_customer': cancelled_by_customer},
        images=images,
    )
    return f'Order #{order.pk} {kind} email sent to {order.user.email}'

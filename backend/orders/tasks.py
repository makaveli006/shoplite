from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import Order


@shared_task(
    autoretry_for=(OSError,),  # network / mail server problems: try again later
    retry_backoff=True,  # wait 1s, 2s, 4s ... between attempts
    max_retries=5,
)
def send_order_confirmation(order_id):
    """Email the customer a summary of their new order. Runs in the Celery worker."""
    order = Order.objects.select_related('user').prefetch_related('items').get(pk=order_id)

    lines = [f'  {item.quantity} x {item.product_name} @ {item.unit_price} = {item.line_total}' for item in order.items.all()]
    message = '\n'.join([
        f'Hi {order.full_name},',
        '',
        f'Thank you for your order #{order.pk}! We have received it and will let you know when it ships.',
        '',
        *lines,
        '',
        f'  Total: {order.total_amount}',
        '',
        'Shipping to:',
        f'  {order.full_name}',
        f'  {order.address}',
        f'  {order.postal_code} {order.city}',
        f'  {order.country}',
        '',
        'ShopLite',
    ])

    send_mail(
        subject=f'ShopLite order #{order.pk} confirmation',
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
    )
    return f'Confirmation for order #{order.pk} sent to {order.user.email}'

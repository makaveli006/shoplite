import logging
from decimal import Decimal

from django.db import transaction

from orders.models import Order
from orders.services import change_status

from . import gateway
from .models import Payment

logger = logging.getLogger(__name__)

MINIMUM_AMOUNT = 100  # Razorpay's smallest payment: ₹1.00 = 100 paise


class PaymentError(Exception):
    """This order can't be paid right now (message for the customer)."""


def amount_in_paise(amount):
    """Decimal('49.99') -> 4999. Exact: money never goes through float."""
    return int((Decimal(amount) * 100).quantize(Decimal('1')))


def start_payment(order):
    """Get a Razorpay order for this shop order, ready for the payment window.

    Trying again (window closed, payment failed) reuses the waiting one, so the Razorpay
    Dashboard doesn't fill up with duplicates.
    """
    if order.status != Order.Status.PENDING:
        raise PaymentError(f'This order is {order.get_status_display().lower()} and can no longer be paid.')

    amount = amount_in_paise(order.total_amount)
    if amount < MINIMUM_AMOUNT:
        raise PaymentError('Online payment needs a total of at least ₹1.')

    waiting = order.payments.filter(status__in=[Payment.Status.CREATED, Payment.Status.FAILED], amount=amount).first()
    if waiting:
        return waiting

    razorpay_order = gateway.create_razorpay_order(order, amount)  # may raise PaymentGatewayError
    return Payment.objects.create(
        order=order,
        razorpay_order_id=razorpay_order['id'],
        amount=amount,
        currency=razorpay_order.get('currency', ''),
    )


@transaction.atomic
def mark_paid(razorpay_order_id, razorpay_payment_id, via, amount=None):
    """Record a confirmed payment and mark the order paid. Returns the Payment (or None).

    Both confirmations call this: the payment window's receipt (via='checkout') and Razorpay's
    webhook (via='webhook'). Whichever comes first does the work; the second finds the payment
    already paid and changes nothing, so the "Payment received" email is sent only once.
    """
    # Lock the payment row: the two confirmations can arrive at the same moment.
    payment = Payment.objects.select_for_update().select_related('order').filter(razorpay_order_id=razorpay_order_id).first()
    if payment is None:
        logger.warning('Payment confirmation for an unknown Razorpay order %s', razorpay_order_id)
        return None
    if payment.status == Payment.Status.PAID:
        return payment  # already done by the other confirmation

    if amount is not None and amount != payment.amount:
        logger.error(
            'Razorpay order %s: paid %s but expected %s. Not marking the order paid.',
            razorpay_order_id, amount, payment.amount,
        )
        return payment

    payment.status = Payment.Status.PAID
    payment.razorpay_payment_id = razorpay_payment_id
    payment.confirmed_via = via
    payment.error_description = ''
    payment.save(update_fields=['status', 'razorpay_payment_id', 'confirmed_via', 'error_description', 'updated_at'])

    order = payment.order
    order.refresh_from_db()
    if order.status == Order.Status.PENDING:
        change_status(order.pk, Order.Status.PAID)  # also queues the "Payment received" email
    elif order.status == Order.Status.CANCELLED:
        # The customer (or the shop) cancelled while the payment was going through.
        logger.error('Order #%s was paid (%s) but is cancelled: refund it in the Razorpay Dashboard.',
                     order.pk, razorpay_payment_id)
    return payment


@transaction.atomic
def mark_failed(razorpay_order_id, razorpay_payment_id, description):
    """Remember why a payment attempt failed. The order stays pending, so the customer can retry."""
    payment = Payment.objects.select_for_update().filter(razorpay_order_id=razorpay_order_id).first()
    if payment is None or payment.status == Payment.Status.PAID:
        return payment  # unknown, or a later attempt already succeeded
    payment.status = Payment.Status.FAILED
    payment.razorpay_payment_id = razorpay_payment_id or payment.razorpay_payment_id
    payment.error_description = (description or 'The payment failed.')[:255]
    payment.save(update_fields=['status', 'razorpay_payment_id', 'error_description', 'updated_at'])
    return payment

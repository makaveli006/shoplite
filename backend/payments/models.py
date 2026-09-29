from django.db import models

from orders.models import Order


class Payment(models.Model):
    """One attempt to pay an order through Razorpay.

    Each attempt has its own "Razorpay order" (Razorpay's record of the amount to collect).
    A customer who closes the payment window and tries again reuses the same one.
    """

    class Status(models.TextChoices):
        CREATED = 'created', 'Waiting for payment'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'

    class ConfirmedVia(models.TextChoices):
        # Which of the two confirmations arrived first (the second one changes nothing).
        CHECKOUT = 'checkout', 'Checkout (browser)'
        WEBHOOK = 'webhook', 'Webhook (Razorpay server)'

    # PROTECT: a payment record must never disappear together with its order.
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='payments')
    razorpay_order_id = models.CharField(max_length=50, unique=True)  # order_...
    razorpay_payment_id = models.CharField(max_length=50, blank=True)  # pay_..., once the customer paid
    amount = models.PositiveIntegerField(help_text='In the smallest unit of the currency (paise for INR).')
    currency = models.CharField(max_length=3)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.CREATED, db_index=True)
    confirmed_via = models.CharField(max_length=10, choices=ConfirmedVia.choices, blank=True)
    error_description = models.CharField(max_length=255, blank=True)  # why the last attempt failed
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']

    def __str__(self):
        return f'{self.razorpay_order_id} for order #{self.order_id}'

    @property
    def needs_refund(self):
        """Money was taken, but the order was cancelled meanwhile: refund it in the Razorpay Dashboard."""
        return self.status == self.Status.PAID and self.order.status == Order.Status.CANCELLED


class WebhookEvent(models.Model):
    """Every Razorpay webhook event that was handled, so a repeated delivery is recognised and skipped."""

    event_id = models.CharField(max_length=100, unique=True)  # the x-razorpay-event-id header
    event = models.CharField(max_length=50)  # e.g. payment.captured
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-received_at']

    def __str__(self):
        return f'{self.event} ({self.event_id})'

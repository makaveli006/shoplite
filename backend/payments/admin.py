from django.contrib import admin

from .models import Payment, WebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Read-only: payments are a record of what Razorpay did. Refunds happen in the Razorpay Dashboard."""

    list_display = ('razorpay_order_id', 'order', 'customer', 'amount_display', 'status', 'confirmed_via',
                    'refund_needed', 'created_at')
    list_filter = ('status', 'confirmed_via', 'created_at')
    search_fields = ('razorpay_order_id', 'razorpay_payment_id', 'order__id', 'order__user__email')
    list_select_related = ('order', 'order__user')
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description='Customer')
    def customer(self, payment):
        return payment.order.user

    @admin.display(description='Amount', ordering='amount')
    def amount_display(self, payment):
        return f'{payment.amount / 100:,.2f} {payment.currency}'

    @admin.display(description='Needs refund', boolean=True)
    def refund_needed(self, payment):
        # Paid, but the order was cancelled meanwhile: refund it in the Razorpay Dashboard.
        return payment.needs_refund


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    """The webhook events Razorpay delivered (each handled once, even if Razorpay sent it again)."""

    list_display = ('event', 'event_id', 'received_at')
    list_filter = ('event', 'received_at')
    search_fields = ('event_id',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

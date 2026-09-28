from django.contrib import admin, messages
from django.db.models import Count

from .models import Order, OrderItem
from .services import OrderStatusError, change_status


class OrderItemInline(admin.TabularInline):
    """An order's lines, shown read-only: they are a record of the purchase."""

    model = OrderItem
    extra = 0
    fields = ('product', 'product_name', 'unit_price', 'quantity', 'line_total')
    readonly_fields = fields
    can_delete = False

    @admin.display(description='Line total')
    def line_total(self, obj):
        return obj.line_total

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user', 'status', 'item_count', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'user__email', 'full_name', 'city')
    list_select_related = ('user',)
    date_hierarchy = 'created_at'
    inlines = (OrderItemInline,)
    # Orders come only from checkout, and their contents never change afterwards.
    # Status changes will get their own admin actions (Lesson 7.4) that follow the allowed transitions.
    readonly_fields = ('user', 'status', 'total_amount', 'created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('user', 'status', 'total_amount', 'created_at', 'updated_at')}),
        ('Shipping address', {'fields': ('full_name', 'address', 'city', 'postal_code', 'country', 'phone')}),
    )

    def get_queryset(self, request):
        # Explicit order_by: Meta.ordering is ignored in GROUP BY (annotate) queries.
        return super().get_queryset(request).annotate(_item_count=Count('items')).order_by('-created_at', '-id')

    @admin.display(description='Items', ordering='_item_count')
    def item_count(self, obj):
        return obj._item_count

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    # ---- Status actions: they follow Order.ALLOWED_TRANSITIONS via change_status() ----
    actions = ('mark_paid', 'mark_shipped', 'mark_delivered', 'mark_cancelled')

    def _change_selected(self, request, queryset, new_status):
        changed, refused = 0, []
        for order in queryset:
            try:
                change_status(order.pk, new_status)
            except OrderStatusError as error:
                refused.append(f'{order}: {error}')
            else:
                changed += 1
                # Unlike queryset.update(), this records the change in the order's History.
                self.log_change(request, order, f'Status changed to {new_status}.')
        if changed:
            self.message_user(request, f'{changed} order(s) changed to {new_status}.', messages.SUCCESS)
        for message in refused:
            self.message_user(request, message, messages.WARNING)

    @admin.action(description='Mark selected orders as paid')
    def mark_paid(self, request, queryset):
        self._change_selected(request, queryset, Order.Status.PAID)

    @admin.action(description='Mark selected orders as shipped')
    def mark_shipped(self, request, queryset):
        self._change_selected(request, queryset, Order.Status.SHIPPED)

    @admin.action(description='Mark selected orders as delivered')
    def mark_delivered(self, request, queryset):
        self._change_selected(request, queryset, Order.Status.DELIVERED)

    @admin.action(description='Cancel selected orders (returns stock)')
    def mark_cancelled(self, request, queryset):
        self._change_selected(request, queryset, Order.Status.CANCELLED)

from django.contrib import admin
from django.db.models import Count

from .models import Order, OrderItem


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

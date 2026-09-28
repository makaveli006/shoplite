from django.contrib import admin
from django.db.models import Count

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    """Shows a cart's items as a small table inside the cart's page."""

    model = CartItem
    extra = 0  # no empty "add another" rows by default
    autocomplete_fields = ('product',)
    readonly_fields = ('line_total', 'added_at')
    fields = ('product', 'quantity', 'line_total', 'added_at')

    @admin.display(description='Line total')
    def line_total(self, obj):
        return obj.line_total if obj.pk else '-'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_count', 'total', 'updated_at')
    search_fields = ('user__email', 'user__username')
    list_select_related = ('user',)
    readonly_fields = ('total', 'created_at', 'updated_at')
    inlines = (CartItemInline,)

    def get_queryset(self, request):
        # Count items in the same query. order_by is explicit because Meta.ordering
        # is ignored in GROUP BY queries (Lesson 3.5). prefetch_related loads all
        # items and their products in one extra query, so "total" causes no N+1.
        return (
            super().get_queryset(request)
            .annotate(_item_count=Count('items'))
            .prefetch_related('items__product')
            .order_by('-updated_at')
        )

    @admin.display(description='Items', ordering='_item_count')
    def item_count(self, obj):
        return obj._item_count

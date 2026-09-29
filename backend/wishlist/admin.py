from django.contrib import admin

from .models import WishlistItem


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    """See what customers are saving (e.g. which products are popular) and clean up if needed."""

    list_display = ('product', 'user', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('user__email', 'product__name')
    list_select_related = ('product', 'user')
    autocomplete_fields = ('user', 'product')  # search boxes instead of huge dropdowns
    date_hierarchy = 'added_at'

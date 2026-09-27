from django.contrib import admin
from django.db.models import Count
from django.utils import timezone

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count', 'created_at')
    search_fields = ('name',)
    # While typing the name, the admin's JavaScript fills in the slug.
    prepopulated_fields = {'slug': ('name',)}

    def get_queryset(self, request):
        # Count each category's products in the SAME query (one SQL query for
        # the whole list instead of one extra query per row).
        return super().get_queryset(request).annotate(_product_count=Count('products'))

    @admin.display(description='Products', ordering='_product_count')
    def product_count(self, obj):
        return obj._product_count


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_active', 'updated_at')
    list_filter = ('is_active', 'category', 'created_at')
    # Edit these columns directly in the list, then press "Save".
    list_editable = ('price', 'stock', 'is_active')
    search_fields = ('name', 'description', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    # Search-as-you-type box for the category (uses CategoryAdmin.search_fields).
    autocomplete_fields = ('category',)
    # Fetch each product's category with a JOIN instead of a separate query per row.
    list_select_related = ('category',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25
    actions = ('make_active', 'make_inactive')

    # Note: queryset.update() runs ONE SQL UPDATE and skips Model.save(), so
    # auto_now fields are not touched automatically - we set updated_at ourselves.

    @admin.action(description='Show selected products in the shop')
    def make_active(self, request, queryset):
        updated = queryset.update(is_active=True, updated_at=timezone.now())
        self.message_user(request, f'{updated} product(s) are now visible in the shop.')

    @admin.action(description='Hide selected products from the shop')
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False, updated_at=timezone.now())
        self.message_user(request, f'{updated} product(s) are now hidden from the shop.')

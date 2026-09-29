from django.contrib import admin, messages
from django.utils.text import Truncator

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Moderation: staff can find, hide/show and delete reviews, but not rewrite them."""

    list_display = ('product', 'user', 'rating', 'short_comment', 'is_visible', 'created_at')
    list_display_links = ('product',)
    list_filter = ('is_visible', 'rating', 'created_at')
    list_editable = ('is_visible',)  # tick/untick to hide or show, right in the list
    search_fields = ('product__name', 'user__email', 'comment')
    list_select_related = ('product', 'user')
    date_hierarchy = 'created_at'
    fields = ('product', 'user', 'rating', 'comment', 'is_visible', 'created_at', 'updated_at')
    # A review is the customer's own words: staff may hide or delete it, never change it.
    readonly_fields = ('product', 'user', 'rating', 'comment', 'created_at', 'updated_at')
    actions = ('hide_reviews', 'show_reviews')

    def has_add_permission(self, request):
        return False  # reviews are written by customers in the shop

    @admin.display(description='Comment')
    def short_comment(self, review):
        return Truncator(review.comment).chars(60) or '—'

    @admin.action(description='Hide selected reviews')
    def hide_reviews(self, request, queryset):
        changed = queryset.update(is_visible=False)
        self.message_user(request, f'{changed} review(s) hidden from the shop.', messages.SUCCESS)

    @admin.action(description='Show selected reviews')
    def show_reviews(self, request, queryset):
        changed = queryset.update(is_visible=True)
        self.message_user(request, f'{changed} review(s) shown in the shop again.', messages.SUCCESS)

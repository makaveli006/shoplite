from django.conf import settings
from django.db import models

from catalog.models import Product


class WishlistItem(models.Model):
    """A product a customer saved for later (the heart button)."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist_items')
    # CASCADE: a deleted product simply disappears from everyone's wishlist.
    # (A product that is only hidden, is_active=False, stays and is shown as "no longer available".)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_at', '-id']  # newest first
        constraints = [
            # Each product at most once per wishlist, guaranteed by PostgreSQL itself.
            models.UniqueConstraint(fields=['user', 'product'], name='unique_product_per_wishlist'),
        ]

    def __str__(self):
        return f'{self.product} in the wishlist of {self.user}'

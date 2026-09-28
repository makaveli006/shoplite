from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from catalog.models import Product


class Cart(models.Model):
    """A customer's shopping cart. Exactly one per user, created the first time it's needed."""

    # One user <-> one cart. Deleting the user deletes their cart.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Cart of {self.user}'

    @property
    def total(self):
        """Sum of all line totals, using each product's CURRENT price."""
        return sum((item.line_total for item in self.items.all()), start=Decimal('0.00'))


class CartItem(models.Model):
    """One product in a cart, with a quantity."""

    # Deleting a cart deletes its items. Deleting a product removes it from every cart.
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['added_at', 'id']
        constraints = [
            # A product appears at most once per cart; adding it again raises the quantity.
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_product_per_cart'),
            # Remove an item instead of setting its quantity to 0.
            models.CheckConstraint(condition=models.Q(quantity__gte=1), name='cart_item_quantity_at_least_1'),
        ]

    def __str__(self):
        return f'{self.quantity} x {self.product}'

    @property
    def line_total(self):
        return self.product.price * self.quantity

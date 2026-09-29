from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from catalog.models import Product


class Review(models.Model):
    """A customer's star rating (and optional comment) for a product they received."""

    # CASCADE: a review has no meaning without its product or its author.
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(max_length=2000, blank=True)
    # Staff can hide a review (spam, insults) in the Django admin without deleting it.
    # Hidden reviews are left out of the shop and of the product's average rating.
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']
        constraints = [
            # One review per customer per product, guaranteed by PostgreSQL itself.
            models.UniqueConstraint(fields=['user', 'product'], name='one_review_per_customer_per_product'),
            models.CheckConstraint(condition=models.Q(rating__gte=1, rating__lte=5), name='review_rating_1_to_5'),
        ]

    def __str__(self):
        return f'{self.rating}★ for {self.product} by {self.user}'

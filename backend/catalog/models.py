from decimal import Decimal

from django.contrib.postgres.indexes import GinIndex, OpClass
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """A group of products, e.g. "Kitchen" or "Stationery"."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Fill the slug from the name if it was left blank ("Home & Kitchen" -> "home-kitchen").
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Something the store sells."""

    # Many products belong to one category. PROTECT: a category that still has
    # products cannot be deleted. related_name: category.products.all()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    # Money is always Decimal (exact), never float.
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
    )
    stock = models.PositiveIntegerField(default=0)
    # The file is saved under MEDIA_ROOT/products/<year>/<month>/; the database
    # column only stores that relative path (a short string), not the image itself.
    image = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    # Hide a product from the shop without deleting it (old orders still refer to it).
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            # Enforced by PostgreSQL itself, even if validation is bypassed.
            models.CheckConstraint(condition=models.Q(price__gt=0), name='product_price_positive'),
        ]
        indexes = [
            # A "trigram" index on the name: lets PostgreSQL find look-alike names (typos) and
            # "contains" matches without reading every product. (It needs the pg_trgm extension,
            # installed by migration 0003.)
            GinIndex(OpClass('name', name='gin_trgm_ops'), name='product_name_trgm_idx'),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

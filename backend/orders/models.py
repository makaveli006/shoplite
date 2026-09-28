from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from catalog.models import Product


class Order(models.Model):
    """A placed order: a permanent snapshot of what was bought, for how much, and where it goes."""

    class Status(models.TextChoices):
        # value stored in the database, label shown to people
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    # The only status changes that are allowed: current status -> possible next statuses.
    ALLOWED_TRANSITIONS = {
        Status.PENDING: {Status.PAID, Status.CANCELLED},
        Status.PAID: {Status.SHIPPED, Status.CANCELLED},
        Status.SHIPPED: {Status.DELIVERED},
        Status.DELIVERED: set(),
        Status.CANCELLED: set(),
    }

    # PROTECT: a customer who has orders cannot be deleted (deactivate them instead).
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)

    # Shipping address, copied at checkout.
    full_name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=30, blank=True)

    # Calculated once at checkout from the frozen line prices, then never recalculated.
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-id']
        constraints = [
            models.CheckConstraint(condition=models.Q(total_amount__gte=0), name='order_total_not_negative'),
        ]

    def __str__(self):
        return f'Order #{self.pk}'

    def can_change_status_to(self, new_status):
        return new_status in self.ALLOWED_TRANSITIONS.get(self.status, set())


class OrderItem(models.Model):
    """One line of an order. Name and price are copies, so the line never changes later."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    # SET_NULL: if the product is deleted one day, the line stays (with its copied name and price).
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
    )
    product_name = models.CharField(max_length=200)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        ordering = ['id']
        constraints = [
            models.CheckConstraint(condition=models.Q(quantity__gte=1), name='order_item_quantity_at_least_1'),
        ]

    def __str__(self):
        return f'{self.quantity} x {self.product_name}'

    @property
    def line_total(self):
        return self.unit_price * self.quantity

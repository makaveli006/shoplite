from rest_framework import serializers

from .models import Order, OrderItem


class ShippingSerializer(serializers.Serializer):
    """Input for POST /api/orders/checkout/."""

    full_name = serializers.CharField(max_length=150)
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True, default='')


class OrderItemSerializer(serializers.ModelSerializer):
    # The product's slug for a "view product" link, or null if the product was deleted.
    product_slug = serializers.SlugRelatedField(source='product', slug_field='slug', read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_slug', 'product_name', 'unit_price', 'quantity', 'line_total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display', 'total_amount', 'items', 'customer_email',
            'full_name', 'address', 'city', 'postal_code', 'country', 'phone',
            'created_at', 'updated_at',
        ]


class OrderStatusSerializer(serializers.Serializer):
    """Input for PATCH /api/orders/<id>/status/: {"status": "paid"}."""

    status = serializers.ChoiceField(choices=Order.Status.choices)

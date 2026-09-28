from rest_framework import serializers

from catalog.models import Product

from .models import Cart, CartItem


class CartProductSerializer(serializers.ModelSerializer):
    """The product details a cart line needs (a smaller version of ProductSerializer)."""

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'stock', 'image', 'is_active']


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    # A message explaining why this line can't be bought right now, or null if it's fine.
    issue = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'line_total', 'issue', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    has_issues = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'item_count', 'total', 'has_issues', 'updated_at']

    def get_item_count(self, cart):
        # Total number of pieces (2 mugs + 1 pen = 3), used for the cart badge in the navbar.
        return sum(item.quantity for item in cart.items.all())

    def get_has_issues(self, cart):
        # True if any line can't be bought; checkout will refuse such a cart (Phase 7).
        return any(item.issue for item in cart.items.all())


class AddCartItemSerializer(serializers.Serializer):
    """Input for POST /api/cart/items/: {"product_id": 7, "quantity": 2}."""

    # Only products visible in the shop can be added.
    product_id = serializers.PrimaryKeyRelatedField(
        source='product',
        queryset=Product.objects.filter(is_active=True),
        error_messages={'does_not_exist': 'This product does not exist or is no longer available.'},
    )
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate(self, attrs):
        cart = self.context['cart']
        product = attrs['product']
        existing = cart.items.filter(product=product).first()
        already_in_cart = existing.quantity if existing else 0
        new_quantity = already_in_cart + attrs['quantity']

        if product.stock == 0:
            raise serializers.ValidationError({'product_id': f'"{product.name}" is out of stock.'})
        if new_quantity > product.stock:
            message = f'Only {product.stock} of "{product.name}" in stock.'
            if already_in_cart:
                message += f' You already have {already_in_cart} in your cart.'
            raise serializers.ValidationError({'quantity': message})

        attrs['existing'] = existing
        attrs['new_quantity'] = new_quantity
        return attrs

    def save(self):
        cart = self.context['cart']
        existing = self.validated_data['existing']
        if existing:
            # Already in the cart: raise the quantity instead of adding a second line.
            existing.quantity = self.validated_data['new_quantity']
            existing.save(update_fields=['quantity', 'updated_at'])
            self.created = False
            return existing
        self.created = True
        return cart.items.create(
            product=self.validated_data['product'],
            quantity=self.validated_data['new_quantity'],
        )


class UpdateCartItemSerializer(serializers.ModelSerializer):
    """Input for PATCH /api/cart/items/<id>/: {"quantity": 3}."""

    class Meta:
        model = CartItem
        fields = ['quantity']

    def validate_quantity(self, value):
        product = self.instance.product
        if value > product.stock:
            raise serializers.ValidationError(f'Only {product.stock} of "{product.name}" in stock.')
        return value

from rest_framework import serializers

from catalog.models import Product

from .models import WishlistItem


class WishlistProductSerializer(serializers.ModelSerializer):
    """The product details the wishlist page needs (a smaller version of ProductSerializer)."""

    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'stock', 'in_stock', 'image', 'is_active']

    def get_in_stock(self, product):
        return product.stock > 0


class WishlistItemSerializer(serializers.ModelSerializer):
    product = WishlistProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


class AddWishlistItemSerializer(serializers.Serializer):
    """Input for POST /api/wishlist/: {"product_id": 7}"""

    # Only products that are on sale can be saved; anything else is a 400 error.
    product_id = serializers.PrimaryKeyRelatedField(
        source='product',
        queryset=Product.objects.filter(is_active=True),
        error_messages={'does_not_exist': 'This product does not exist or is no longer available.'},
    )

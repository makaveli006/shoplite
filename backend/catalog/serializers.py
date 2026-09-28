from django.utils.text import slugify
from rest_framework import serializers

from .models import Category, Product

MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB


class CategorySerializer(serializers.ModelSerializer):
    """Full category, used by the /api/categories/ endpoints."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class CategorySummarySerializer(serializers.ModelSerializer):
    """Small version of a category, nested inside each product."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    """Converts Product objects <-> JSON.

    Reading:  "category": {"id": 2, "name": "Kitchen", "slug": "kitchen"}
    Writing:  "category_id": 2
    """

    # Output only: the nested category object.
    category = CategorySummarySerializer(read_only=True)
    # Input only: the category's id. source='category' means "this sets product.category".
    # DRF checks the id exists in the queryset, otherwise it returns a 400 error.
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
    )
    # Computed, read-only value that is not a database column.
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'in_stock',
            'image',
            'is_active',
            'category',
            'category_id',
            'created_at',
            'updated_at',
        ]
        # Allow {"image": null} to remove a product's image.
        extra_kwargs = {'image': {'allow_null': True}}

    def get_in_stock(self, obj):
        return obj.stock > 0

    def validate_image(self, value):
        """Field-level validation: runs for the "image" field only (after DRF/Pillow
        have already checked that the upload is a real image)."""
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(
                f'The image is {value.size / 1024 / 1024:.1f} MB. The maximum is 2 MB.'
            )
        return value

    def validate(self, attrs):
        """Object-level validation: runs after every field has been validated on its own."""
        # When creating a product without a slug, Product.save() would build one from
        # the name. Check it here so a duplicate returns a clear 400 error instead of
        # crashing with a database IntegrityError (500).
        if self.instance is None and not attrs.get('slug'):
            slug = slugify(attrs['name'])
            if not slug:
                raise serializers.ValidationError(
                    {'name': 'The name must contain at least one letter or digit.'}
                )
            if Product.objects.filter(slug=slug).exists():
                raise serializers.ValidationError(
                    {'slug': f'A product with the slug "{slug}" already exists. '
                             'Use a different name or send your own slug.'}
                )
            attrs['slug'] = slug
        return attrs

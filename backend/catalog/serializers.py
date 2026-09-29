from django.utils.text import slugify
from rest_framework import serializers

from .models import Category, Product

MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB


class CategorySerializer(serializers.ModelSerializer):
    """Full category, used by the /api/categories/ endpoints."""

    # How many products use this category (a category with products can't be deleted).
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']

    def get_product_count(self, category):
        # Filled in by the view's query; a category that was just created has none yet.
        return getattr(category, 'product_count', 0)


class CategorySummarySerializer(serializers.ModelSerializer):
    """Small version of a category, nested inside each product."""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSuggestionSerializer(serializers.ModelSerializer):
    """A small product for the search box's dropdown."""

    category = CategorySummarySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'image', 'category']


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
    # Computed, read-only values that are not database columns.
    in_stock = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()  # e.g. 4.3, or null without reviews
    review_count = serializers.SerializerMethodField()
    # While searching: the description with the matched words wrapped in \x02...\x03 (or null).
    search_snippet = serializers.SerializerMethodField()

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
            'average_rating',
            'review_count',
            'search_snippet',
            'created_at',
            'updated_at',
        ]
        # Allow {"image": null} to remove a product's image.
        extra_kwargs = {'image': {'allow_null': True}}

    def get_in_stock(self, obj):
        return obj.stock > 0

    # The two ratings are filled in by ProductViewSet's query; a product that was just
    # created (or loaded elsewhere) has none, so fall back to "no reviews".
    def get_average_rating(self, obj):
        average = getattr(obj, 'average_rating', None)
        return None if average is None else round(average, 1)

    def get_review_count(self, obj):
        return getattr(obj, 'review_count', 0)

    def get_search_snippet(self, obj):
        # Only useful when a description word matched: otherwise it's just the description's start.
        snippet = getattr(obj, 'search_snippet', None)
        return snippet if snippet and '\x02' in snippet else None

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

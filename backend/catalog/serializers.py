from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Converts Product objects <-> JSON.

    ModelSerializer reads the model to build matching serializer fields
    (types, max lengths, validators), so we only list which fields to include.
    """

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'image',
            'is_active',
            'category',
            'created_at',
            'updated_at',
        ]

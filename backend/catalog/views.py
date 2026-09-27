from rest_framework import generics

from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    """GET /api/products/ -> list of products visible in the shop."""

    # Only active products are public. select_related avoids the N+1 problem
    # as soon as the serializer shows category details (Lesson 4.2).
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/ -> one product, or 404."""

    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'  # find the product by its slug instead of its numeric id

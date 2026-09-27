from rest_framework import generics

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListAPIView):
    """GET /api/categories/ -> all categories."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveAPIView):
    """GET /api/categories/<slug>/ -> one category, or 404."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    """GET /api/products/ -> list of products visible in the shop."""

    # Only active products are public. select_related fetches each product's
    # category in the same query, so the nested category causes no N+1 queries.
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/ -> one product, or 404."""

    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'  # find the product by its slug instead of its numeric id

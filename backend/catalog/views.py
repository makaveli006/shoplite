from django.db.models import ProtectedError
from rest_framework import status, viewsets
from rest_framework.response import Response

from core.permissions import IsAdminOrReadOnly

from .filters import ProductFilter
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET    /api/categories/          list            (anyone)
    POST   /api/categories/          create          (admin)
    GET    /api/categories/<slug>/   retrieve        (anyone)
    PUT    /api/categories/<slug>/   full update     (admin)
    PATCH  /api/categories/<slug>/   partial update  (admin)
    DELETE /api/categories/<slug>/   delete          (admin)
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    # Only a handful of categories: return them all as a plain list (no pages),
    # which is simpler for the frontend's category dropdown.
    pagination_class = None

    def destroy(self, request, *args, **kwargs):
        # A category that still has products is protected (on_delete=PROTECT).
        # Turn Django's ProtectedError into a clear 409 instead of a 500 crash.
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': 'This category still has products. Move or delete them first.'},
                status=status.HTTP_409_CONFLICT,
            )


class ProductViewSet(viewsets.ModelViewSet):
    """Same six actions as CategoryViewSet, for products (looked up by slug)."""

    queryset = Product.objects.select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    # ?category=kitchen&min_price=10&max_price=50&in_stock=true  (catalog/filters.py)
    filterset_class = ProductFilter
    # ?search=mug -> case-insensitive "contains" match in any of these fields
    search_fields = ['name', 'description', 'category__name']
    # ?ordering=price, ?ordering=-price, ?ordering=name ... (only these fields are allowed)
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['-created_at']  # default when no ?ordering= is given

    def get_queryset(self):
        queryset = super().get_queryset()
        # Staff can see (and therefore edit) hidden products; everyone else only active ones.
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(is_active=True)

from django.db.models import Avg, Count, FloatField, ProtectedError, Q, Value
from django.db.models.functions import Coalesce
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import IsAdminOrReadOnly

from .filters import ProductFilter, ProductOrderingFilter, ProductSearchFilter, search_text
from .models import Category, Product
from .search import did_you_mean, suggest
from .serializers import CategorySerializer, ProductSerializer, ProductSuggestionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET    /api/categories/          list            (anyone)
    POST   /api/categories/          create          (admin)
    GET    /api/categories/<slug>/   retrieve        (anyone)
    PUT    /api/categories/<slug>/   full update     (admin)
    PATCH  /api/categories/<slug>/   partial update  (admin)
    DELETE /api/categories/<slug>/   delete          (admin)
    """

    # Count each category's products (hidden ones included) in the same query.
    # Explicit order_by: Meta.ordering is ignored in GROUP BY queries (Lesson 3.5).
    queryset = Category.objects.annotate(product_count=Count('products')).order_by('name')
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

    # Filters (?category=...), then search (?search=..., catalog/search.py), then ordering.
    filter_backends = [DjangoFilterBackend, ProductSearchFilter, ProductOrderingFilter]
    # ?category=kitchen&min_price=10&max_price=50&in_stock=true  (catalog/filters.py)
    filterset_class = ProductFilter
    # ?ordering=price, ?ordering=-price, ?ordering=name, ?ordering=-rating (top rated),
    # ?ordering=-relevance (best match, the default while searching). Only these are allowed.
    ordering_fields = ['price', 'name', 'created_at', 'rating', 'relevance']
    # Default when no ?ordering= is given. Also needed because of the annotate() below:
    # Meta.ordering is ignored in GROUP BY queries.
    ordering = ['-created_at']

    def get_queryset(self):
        # Each product's rating, calculated in the same query from its visible reviews
        # (reviews hidden by staff don't count).
        visible = Q(reviews__is_visible=True)
        queryset = super().get_queryset().annotate(
            review_count=Count('reviews', filter=visible),
            average_rating=Avg('reviews__rating', filter=visible),  # None when there are no reviews
            # For sorting by "top rated": products without reviews count as 0, so they come
            # last. (PostgreSQL would put the empty values first when sorting high to low.)
            rating=Coalesce(Avg('reviews__rating', filter=visible), Value(0.0), output_field=FloatField()),
        )
        # Staff can see (and therefore edit) hidden products; everyone else only active ones.
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        text = search_text(request)
        if text:
            # "Did you mean headphones?" when nothing matches the typed words exactly.
            shop = Product.objects.filter(is_active=True)
            response.data['did_you_mean'] = did_you_mean(shop, text)
        return response

    @action(detail=False, url_path='suggest', permission_classes=[IsAdminOrReadOnly], pagination_class=None)
    def suggest(self, request):
        """GET /api/products/suggest/?q=hea -> up to 6 product names for the search box's dropdown.

        (This address takes the place of a product with the slug "suggest".)
        """
        products = Product.objects.filter(is_active=True).select_related('category')
        matches = suggest(products, request.query_params.get('q', ''))
        return Response(ProductSuggestionSerializer(matches, many=True, context={'request': request}).data)

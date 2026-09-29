from django.db.models import CharField, FloatField, Value
from django_filters import rest_framework as filters
from rest_framework.filters import BaseFilterBackend

from core.filters import StableOrderingFilter

from .models import Product
from .search import search_products

SEARCH_PARAM = 'search'


def search_text(request):
    return request.query_params.get(SEARCH_PARAM, '').strip()


class ProductFilter(filters.FilterSet):
    """URL query parameters for filtering the product list.

    /api/products/?category=kitchen&min_price=10&max_price=50&in_stock=true
    """

    # ?category=kitchen -> WHERE category.slug = 'kitchen'
    category = filters.CharFilter(field_name='category__slug')
    # ?min_price=10 -> WHERE price >= 10
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    # ?max_price=50 -> WHERE price <= 50
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    # ?in_stock=true -> stock > 0,  ?in_stock=false -> stock = 0
    in_stock = filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Product
        fields = ['category', 'min_price', 'max_price', 'in_stock']

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset.filter(stock=0)


class ProductSearchFilter(BaseFilterBackend):
    """?search=... with PostgreSQL full-text search and typo tolerance (see catalog/search.py).

    Without a search, every product gets relevance 0 and no snippet, so ?ordering=-relevance
    still works (it then simply falls back to the newest products).
    """

    def filter_queryset(self, request, queryset, view):
        text = search_text(request)
        if not text:
            return queryset.annotate(
                relevance=Value(0.0, output_field=FloatField()),
                search_snippet=Value(None, output_field=CharField()),
            )
        return search_products(queryset, text)


class ProductOrderingFilter(StableOrderingFilter):
    """While searching, the default order is "Best match". Choosing a sort (?ordering=price) wins."""

    def get_ordering(self, request, queryset, view):
        if search_text(request) and not request.query_params.get(self.ordering_param):
            return ['-relevance', '-id']
        return super().get_ordering(request, queryset, view)

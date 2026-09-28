from django_filters import rest_framework as filters

from .models import Product


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

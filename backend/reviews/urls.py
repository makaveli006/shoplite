from django.urls import path

from .views import MyReviewView, ProductReviewListView

# Included in config/urls.py BEFORE catalog.urls, next to the products/<slug>/ addresses.
urlpatterns = [
    path('products/<slug:slug>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    path('products/<slug:slug>/reviews/me/', MyReviewView.as_view(), name='my-product-review'),
]

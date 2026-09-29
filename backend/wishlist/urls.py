from django.urls import path

from . import views

# These are included under "api/" in config/urls.py.
urlpatterns = [
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', views.WishlistItemView.as_view(), name='wishlist-item'),
]

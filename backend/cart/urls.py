from django.urls import path

from . import views

# These are included under "api/" in config/urls.py.
urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/items/', views.CartItemListView.as_view(), name='cart-item-list'),
    path('cart/items/<int:pk>/', views.CartItemDetailView.as_view(), name='cart-item-detail'),
]

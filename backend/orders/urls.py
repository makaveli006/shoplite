from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

# SimpleRouter (not DefaultRouter): it doesn't add a second API overview page at /api/.
router = SimpleRouter()
router.register('orders', views.OrderViewSet, basename='order')

# These are included under "api/" in config/urls.py.
# "checkout" is listed first so it is matched before the router's order-id patterns.
urlpatterns = [
    path('orders/checkout/', views.CheckoutView.as_view(), name='checkout'),
    *router.urls,
]

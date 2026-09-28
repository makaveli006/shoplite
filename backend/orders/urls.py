from django.urls import path

from . import views

# These are included under "api/" in config/urls.py.
urlpatterns = [
    path('orders/checkout/', views.CheckoutView.as_view(), name='checkout'),
]

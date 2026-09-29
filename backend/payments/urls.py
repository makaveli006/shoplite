from django.urls import path

from . import views

# These are included under "api/" in config/urls.py.
urlpatterns = [
    path('payments/start/', views.StartPaymentView.as_view(), name='payment-start'),
    path('payments/verify/', views.VerifyPaymentView.as_view(), name='payment-verify'),
]

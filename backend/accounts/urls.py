from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# These are included under "api/auth/" in config/urls.py.
urlpatterns = [
    # POST {"email": "...", "password": "..."} -> {"access": "...", "refresh": "..."}
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    # POST {"refresh": "..."} -> {"access": "..."}
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

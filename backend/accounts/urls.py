from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

# These are included under "api/auth/" in config/urls.py.
urlpatterns = [
    # POST {"email", "username", "password", "first_name"?, "last_name"?} -> 201 new user
    path('register/', views.RegisterView.as_view(), name='register'),
    # POST {"email": "...", "password": "..."} -> {"access": "...", "refresh": "..."}
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    # POST {"refresh": "..."} -> {"access": "..."}
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    # GET / PATCH the logged-in user's profile
    path('me/', views.MeView.as_view(), name='me'),
    # POST {"email"} -> a reset link is emailed (if the account exists)
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    # POST {"uid", "token", "new_password"} -> the new password is set
    path('password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]

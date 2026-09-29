import logging

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    User,
    UserSerializer,
)
from .tasks import send_password_reset_email

logger = logging.getLogger(__name__)


def password_reset_link(user):
    """The one-time link for the reset email: <frontend>/reset-password/<uid>/<token>.

    Made here, in the web server, and not in the Celery worker: the token contains the time
    it was made, and the web server checks it later with its own clock. If the worker made it
    with a clock set to another time zone, the link could look hours old (or not yet valid).
    """
    # uid: the user's id in a URL-safe form. token: a signed, time-limited value that stops
    # working once the password changes (or after PASSWORD_RESET_TIMEOUT).
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return f'{settings.FRONTEND_URL}/reset-password/{uid}/{token}'


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ -> create a customer account (201) or return errors (400)."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # you can't be logged in before you have an account
    authentication_classes = []  # ignore any (possibly expired) token sent by the client


class MeView(generics.RetrieveUpdateAPIView):
    """GET /api/auth/me/ -> my profile.  PATCH /api/auth/me/ -> change my names."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']  # no PUT: partial updates only

    def get_object(self):
        # No id in the URL: "me" is always the user identified by the token.
        return self.request.user


class PasswordResetRequestView(APIView):
    """POST /api/auth/password-reset/ {"email"} -> always the same answer (200)."""

    permission_classes = [AllowAny]
    authentication_classes = []
    # At most a few requests per hour from one address, so nobody can flood someone's inbox.
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'

    MESSAGE = 'If an account exists for this email, we have sent a link to reset the password.'

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data['email'], is_active=True).first()
        if user:
            try:
                send_password_reset_email.delay(user.pk, password_reset_link(user))
            except Exception:  # the queue (Redis) is unreachable
                logger.exception('Could not queue the password reset email for user %s', user.pk)
        # The same answer whether or not the account exists, so this page can't be used
        # to find out which email addresses have accounts.
        return Response({'detail': self.MESSAGE})


class PasswordResetConfirmView(APIView):
    """POST /api/auth/password-reset/confirm/ {"uid", "token", "new_password"} -> 200, or 400."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Your password has been changed. You can sign in now.'}, status=status.HTTP_200_OK)

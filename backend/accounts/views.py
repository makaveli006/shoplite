from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import RegisterSerializer, UserSerializer


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

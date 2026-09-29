from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


def normalize_email(value):
    """Emails are compared case-insensitively: " Ana@Example.COM " -> "ana@example.com"."""
    return value.strip().lower()


class RegisterSerializer(serializers.ModelSerializer):
    """Creates a new customer account. The password is never returned."""

    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password']
        read_only_fields = ['id']

    def validate_email(self, value):
        value = normalize_email(value)
        # The database's unique constraint is case-sensitive, so check case-insensitively here.
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate(self, attrs):
        # Run Django's AUTH_PASSWORD_VALIDATORS (settings.py): minimum length, too common,
        # entirely numeric, too similar to the email/username.
        # A temporary, unsaved User lets the similarity check compare against the new details.
        candidate = User(**{key: value for key, value in attrs.items() if key != 'password'})
        try:
            validate_password(attrs['password'], user=candidate)
        except DjangoValidationError as error:
            raise serializers.ValidationError({'password': list(error.messages)})
        return attrs

    def create(self, validated_data):
        # create_user() hashes the password (set_password) before saving.
        # Never do User.objects.create(password=...) - that would store the plain text.
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    """The logged-in user's own profile (GET/PATCH /api/auth/me/)."""

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_staff', 'date_joined']
        # Users may change their names, but not their login email, their role or their id.
        read_only_fields = ['id', 'email', 'is_staff', 'date_joined']


class PasswordResetRequestSerializer(serializers.Serializer):
    """Input for POST /api/auth/password-reset/: {"email": "..."}"""

    email = serializers.EmailField()

    def validate_email(self, value):
        return normalize_email(value)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Input for POST /api/auth/password-reset/confirm/: {"uid", "token", "new_password"}"""

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    INVALID_LINK = 'This reset link is invalid or has expired. Please request a new one.'

    def validate(self, attrs):
        # Find the user from the uid, then check the token belongs to them and is still valid.
        try:
            user_id = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=user_id, is_active=True)
        except (ValueError, TypeError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'token': self.INVALID_LINK})
        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'token': self.INVALID_LINK})

        # The same password rules as at registration.
        try:
            validate_password(attrs['new_password'], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({'new_password': list(error.messages)})

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        # set_password hashes it; changing the password also makes the link stop working.
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """The login serializer, with the email normalized the same way as at registration."""

    def validate(self, attrs):
        attrs[self.username_field] = normalize_email(attrs[self.username_field])
        return super().validate(attrs)

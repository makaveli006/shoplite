from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """The store's user model.

    Inherits everything from Django's built-in user (username, password hashing,
    first/last name, is_staff, is_active, date_joined, groups, permissions...).
    Changes: email is required and unique, and customers log in with their email.
    """

    email = models.EmailField('email address', unique=True)

    # The field used to log in (admin login page, and JWT login in Phase 5).
    USERNAME_FIELD = 'email'
    # Extra fields `createsuperuser` asks for (besides USERNAME_FIELD and password).
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

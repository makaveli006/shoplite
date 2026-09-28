"""Small helpers shared by the tests of all apps."""

from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from catalog.models import Category, Product

PASSWORD = 'Sunny-Garden-42'


def make_user(email='customer@example.com', is_staff=False):
    return get_user_model().objects.create_user(
        email=email,
        username=email.split('@')[0],
        password=PASSWORD,
        is_staff=is_staff,
    )


def make_category(name='Kitchen'):
    return Category.objects.create(name=name)


def make_product(category, name='Blue Mug', price='12.50', stock=10, is_active=True):
    return Product.objects.create(
        category=category,
        name=name,
        price=Decimal(price),
        stock=stock,
        is_active=is_active,
    )


def client_for(user=None):
    """An API client, logged in as `user` (or anonymous when user is None)."""
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)
    return client

"""Small helpers shared by the tests of all apps."""

import io
import tempfile
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import override_settings
from PIL import Image
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


def make_picture(name='picture.png', size=(300, 200)):
    """A small, real PNG file (with transparency), ready for product.image.save(name, file)."""
    buffer = io.BytesIO()
    Image.new('RGBA', size, (200, 80, 40, 255)).save(buffer, format='PNG')
    return ContentFile(buffer.getvalue(), name=name)


class TemporaryMediaMixin:
    """Put this first in a test class's bases: files saved by its tests go to a temporary
    folder (deleted afterwards) instead of the real backend/media folder."""

    @classmethod
    def setUpClass(cls):
        media = tempfile.TemporaryDirectory()
        cls.addClassCleanup(media.cleanup)
        cls.enterClassContext(override_settings(MEDIA_ROOT=media.name))
        super().setUpClass()


def client_for(user=None):
    """An API client, logged in as `user` (or anonymous when user is None)."""
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)
    return client

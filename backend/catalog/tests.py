import io
import os

from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from core.testing import client_for, make_category, make_product, make_user

from .models import Category, Product


class ProductReadTests(APITestCase):
    """What anyone can see in the catalog."""

    @classmethod
    def setUpTestData(cls):
        cls.kitchen = make_category('Kitchen')
        cls.books = make_category('Books')
        make_product(cls.kitchen, 'Blue Mug', '12.50', stock=10)
        make_product(cls.kitchen, 'Chef Knife', '49.99', stock=0)
        make_product(cls.kitchen, 'Cutting Board', '18.00', stock=5)
        make_product(cls.books, 'Python Novel', '35.00', stock=3)
        make_product(cls.kitchen, 'Old Mug', '9.00', stock=4, is_active=False)
        cls.admin = make_user('admin@example.com', is_staff=True)

    def names(self, response):
        return [product['name'] for product in response.data['results']]

    def test_list_shows_only_active_products_in_pages(self):
        response = client_for().get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 4)
        self.assertNotIn('Old Mug', self.names(response))

    def test_category_price_filter_and_ordering(self):
        response = client_for().get(
            '/api/products/',
            {'category': 'kitchen', 'min_price': '10', 'max_price': '40', 'ordering': 'price'},
        )
        self.assertEqual(self.names(response), ['Blue Mug', 'Cutting Board'])

    def test_search(self):
        response = client_for().get('/api/products/', {'search': 'novel'})
        self.assertEqual(self.names(response), ['Python Novel'])

    def test_in_stock_filter(self):
        response = client_for().get('/api/products/', {'in_stock': 'false'})
        self.assertEqual(self.names(response), ['Chef Knife'])

    def test_invalid_filter_value_is_rejected(self):
        response = client_for().get('/api/products/', {'min_price': 'abc'})
        self.assertEqual(response.status_code, 400)

    def test_hidden_product_is_invisible_to_public_but_visible_to_admin(self):
        self.assertEqual(client_for().get('/api/products/old-mug/').status_code, 404)
        self.assertEqual(client_for(self.admin).get('/api/products/old-mug/').status_code, 200)


class ProductWriteTests(APITestCase):
    """Only admins may change the catalog."""

    @classmethod
    def setUpTestData(cls):
        cls.kitchen = make_category('Kitchen')
        cls.mug = make_product(cls.kitchen, 'Blue Mug')
        cls.customer = make_user('customer@example.com')
        cls.admin = make_user('admin@example.com', is_staff=True)

    def new_product(self, name='New Teapot'):
        return {'name': name, 'price': '25.00', 'stock': 4, 'category_id': self.kitchen.id}

    def test_anonymous_and_customer_cannot_create(self):
        self.assertEqual(client_for().post('/api/products/', self.new_product(), format='json').status_code, 401)
        self.assertEqual(client_for(self.customer).post('/api/products/', self.new_product(), format='json').status_code, 403)

    def test_admin_creates_product_with_generated_slug(self):
        response = client_for(self.admin).post('/api/products/', self.new_product(), format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['slug'], 'new-teapot')
        self.assertEqual(response.data['category']['name'], 'Kitchen')

    def test_duplicate_name_gives_clear_error_not_crash(self):
        response = client_for(self.admin).post('/api/products/', self.new_product('Blue Mug'), format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('slug', response.data)

    def test_category_with_products_cannot_be_deleted(self):
        response = client_for(self.admin).delete('/api/categories/kitchen/')
        self.assertEqual(response.status_code, 409)
        self.assertTrue(Category.objects.filter(slug='kitchen').exists())

    def test_empty_category_can_be_deleted(self):
        make_category('Empty')
        self.assertEqual(client_for(self.admin).delete('/api/categories/empty/').status_code, 204)

    def test_too_big_image_is_rejected(self):
        # Random noise can't be compressed, so this PNG is about 4 MB (limit: 2 MB).
        buffer = io.BytesIO()
        Image.frombytes('RGB', (1200, 1200), os.urandom(1200 * 1200 * 3)).save(buffer, 'PNG')
        upload = SimpleUploadedFile('big.png', buffer.getvalue(), content_type='image/png')

        response = client_for(self.admin).patch('/api/products/blue-mug/', {'image': upload}, format='multipart')

        self.assertEqual(response.status_code, 400)
        self.assertIn('2 MB', response.data['image'][0])
        self.assertFalse(Product.objects.get(pk=self.mug.pk).image)

from rest_framework.test import APITestCase

from catalog.models import Product
from core.testing import client_for, make_category, make_product, make_user


class CartTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        kitchen = make_category('Kitchen')
        cls.knife = make_product(kitchen, 'Chef Knife', '49.99', stock=5)
        cls.linen = make_product(kitchen, 'Linen Cover', '19.99', stock=0)
        cls.old = make_product(kitchen, 'Old Mug', '9.00', stock=4, is_active=False)
        cls.bob = make_user('bob@example.com')
        cls.ana = make_user('ana@example.com')

    def setUp(self):
        self.client = client_for(self.bob)

    def add(self, product, quantity=None, client=None):
        data = {'product_id': product.id}
        if quantity is not None:
            data['quantity'] = quantity
        return (client or self.client).post('/api/cart/items/', data, format='json')

    def test_cart_requires_login(self):
        self.assertEqual(client_for().get('/api/cart/').status_code, 401)

    def test_adding_same_product_twice_raises_quantity(self):
        self.assertEqual(self.add(self.knife, 2).status_code, 201)
        response = self.add(self.knife)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 3)
        self.assertEqual(response.data['total'], '149.97')

    def test_cannot_add_more_than_stock(self):
        self.add(self.knife, 3)
        response = self.add(self.knife, 5)
        self.assertEqual(response.status_code, 400)
        self.assertIn('already have 3', response.data['quantity'][0])

    def test_cannot_add_out_of_stock_or_hidden_product(self):
        self.assertEqual(self.add(self.linen).status_code, 400)
        self.assertEqual(self.add(self.old).status_code, 400)

    def test_cannot_touch_another_customers_item(self):
        anas_client = client_for(self.ana)
        item_id = self.add(self.knife, client=anas_client).data['items'][0]['id']

        self.assertEqual(self.client.patch(f'/api/cart/items/{item_id}/', {'quantity': 1}, format='json').status_code, 404)
        self.assertEqual(self.client.delete(f'/api/cart/items/{item_id}/').status_code, 404)
        self.assertEqual(anas_client.get('/api/cart/').data['item_count'], 1)

    def test_problem_appearing_later_is_shown_on_the_line(self):
        self.add(self.knife)
        Product.objects.filter(pk=self.knife.pk).update(is_active=False)

        response = self.client.get('/api/cart/')

        self.assertTrue(response.data['has_issues'])
        self.assertEqual(response.data['items'][0]['issue'], 'This product is no longer available.')

    def test_empty_cart(self):
        self.add(self.knife, 2)
        response = self.client.delete('/api/cart/')
        self.assertEqual(response.data['items'], [])
        self.assertEqual(response.data['total'], '0.00')

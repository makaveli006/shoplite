from django.db import IntegrityError, transaction
from rest_framework.test import APITestCase

from catalog.models import Product
from core.testing import client_for, make_category, make_product, make_user

from .models import WishlistItem

URL = '/api/wishlist/'


class WishlistTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        kitchen = make_category('Kitchen')
        cls.knife = make_product(kitchen, 'Chef Knife', '49.99', stock=5)
        cls.mug = make_product(kitchen, 'Blue Mug', '12.50', stock=0)  # out of stock can still be saved
        cls.old = make_product(kitchen, 'Old Kettle', is_active=False)
        cls.bob = make_user('bob@example.com')
        cls.ana = make_user('ana@example.com')

    def setUp(self):
        self.client = client_for(self.bob)

    def save(self, product, client=None):
        return (client or self.client).post(URL, {'product_id': product.id}, format='json')

    def saved_names(self, client=None):
        return [item['product']['name'] for item in (client or self.client).get(URL).data]

    def test_anonymous_visitors_have_no_wishlist(self):
        anonymous = client_for()
        self.assertEqual(anonymous.get(URL).status_code, 401)
        self.assertEqual(anonymous.post(URL, {'product_id': self.knife.id}, format='json').status_code, 401)
        self.assertEqual(anonymous.delete(f'{URL}{self.knife.id}/').status_code, 401)

    def test_save_a_product(self):
        response = self.save(self.knife)

        self.assertEqual(response.status_code, 201)
        product = response.data['product']
        self.assertEqual((product['name'], product['price'], product['in_stock']), ('Chef Knife', '49.99', True))
        self.assertIn('image', product)
        self.assertEqual(self.saved_names(), ['Chef Knife'])

    def test_saving_twice_is_harmless(self):
        self.assertEqual(self.save(self.knife).status_code, 201)
        self.assertEqual(self.save(self.knife).status_code, 200)  # already saved
        self.assertEqual(WishlistItem.objects.count(), 1)

    def test_out_of_stock_products_can_be_saved(self):
        response = self.save(self.mug)
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data['product']['in_stock'])

    def test_hidden_or_missing_products_cannot_be_saved(self):
        for product_id in [self.old.id, 999999]:
            response = self.client.post(URL, {'product_id': product_id}, format='json')
            self.assertEqual(response.status_code, 400)
            self.assertIn('product_id', response.data)
        self.assertEqual(self.client.post(URL, {}, format='json').status_code, 400)

    def test_newest_first_and_only_my_own(self):
        self.save(self.knife)
        self.save(self.mug)
        self.save(self.knife, client=client_for(self.ana))

        self.assertEqual(self.saved_names(), ['Blue Mug', 'Chef Knife'])
        self.assertEqual(self.saved_names(client_for(self.ana)), ['Chef Knife'])

    def test_remove_a_product(self):
        self.save(self.knife)
        self.assertEqual(self.client.delete(f'{URL}{self.knife.id}/').status_code, 204)
        self.assertEqual(self.saved_names(), [])

    def test_removing_something_not_saved_is_harmless(self):
        self.assertEqual(self.client.delete(f'{URL}{self.knife.id}/').status_code, 204)

    def test_removing_only_touches_my_own_wishlist(self):
        ana = client_for(self.ana)
        self.save(self.knife, client=ana)

        self.client.delete(f'{URL}{self.knife.id}/')  # Bob removes "his" knife

        self.assertEqual(self.saved_names(ana), ['Chef Knife'])  # Ana's is still there

    def test_hidden_later_stays_listed_deleted_disappears(self):
        self.save(self.knife)
        self.save(self.mug)
        Product.objects.filter(pk=self.knife.pk).update(is_active=False)  # staff hide it
        self.mug.delete()

        items = self.client.get(URL).data
        self.assertEqual([item['product']['name'] for item in items], ['Chef Knife'])
        self.assertFalse(items[0]['product']['is_active'])  # shown as "no longer available"

    def test_database_allows_each_product_once_per_wishlist(self):
        WishlistItem.objects.create(user=self.bob, product=self.knife)
        with self.assertRaises(IntegrityError), transaction.atomic():
            WishlistItem.objects.create(user=self.bob, product=self.knife)

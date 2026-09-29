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


class ProductSearchTests(APITestCase):
    """PostgreSQL full-text search with typo tolerance (catalog/search.py), on realistic products."""

    @classmethod
    def setUpTestData(cls):
        kitchen = make_category('Kitchen')
        stationery = make_category('Stationery')
        electronics = make_category('Electronics')
        cls.mug = make_product(kitchen, 'Blue Ceramic Mug', '12.50',
                               description='A 350 ml stoneware mug with a glossy blue glaze.')
        make_product(kitchen, 'Chef Knife', '49.99', description='A 20 cm stainless steel chef knife.')
        make_product(kitchen, 'Bamboo Cutting Board', '18.00', description='A sturdy, knife-friendly bamboo board.')
        make_product(kitchen, 'Discontinued Travel Mug', '9.00', is_active=False, description='No longer sold.')
        make_product(stationery, 'Gel Pen Set', '4.50', description='Ten smooth gel pens in assorted colours.')
        make_product(stationery, 'Mechanical Pencil', '3.00', description='A 0.5 mm pencil with a rubber grip.')
        make_product(electronics, 'Noise-Cancelling Headphones', '99.00', description='Over-ear, active noise cancelling.')
        make_product(electronics, 'Bluetooth Speaker', '39.00', description='A pocket speaker with a 12-hour battery.')

    def search(self, text, **params):
        response = client_for().get('/api/products/', {'search': text, **params})
        self.assertEqual(response.status_code, 200)
        return response

    def names(self, response):
        return [product['name'] for product in response.data['results']]

    def test_finds_other_forms_of_a_word(self):
        self.assertEqual(self.names(self.search('mugs')), ['Blue Ceramic Mug'])
        self.assertEqual(self.names(self.search('knives')), ['Chef Knife'])

    def test_finds_words_in_the_description_and_highlights_them(self):
        response = self.search('stoneware')
        self.assertEqual(self.names(response), ['Blue Ceramic Mug'])
        self.assertIn('\x02stoneware\x03', response.data['results'][0]['search_snippet'])

    def test_finds_products_by_their_category(self):
        self.assertEqual(sorted(self.names(self.search('stationery'))), ['Gel Pen Set', 'Mechanical Pencil'])

    def test_name_matches_rank_above_description_matches(self):
        # The knife has "knife" in its name; the board only in its description.
        self.assertEqual(self.names(self.search('knife')), ['Chef Knife', 'Bamboo Cutting Board'])

    def test_look_alikes_only_when_nothing_matches_exactly(self):
        # "pens" matches the pen set itself, so the similar-looking "Pencil" is left out.
        self.assertEqual(self.names(self.search('pens')), ['Gel Pen Set'])

    def test_forgives_typos_and_suggests_the_right_spelling(self):
        response = self.search('headphnes')
        self.assertEqual(self.names(response), ['Noise-Cancelling Headphones'])
        self.assertEqual(response.data['did_you_mean'], 'headphones')

        response = self.search('bluetoth speker')
        self.assertEqual(self.names(response), ['Bluetooth Speaker'])
        self.assertEqual(response.data['did_you_mean'], 'bluetooth speaker')

    def test_no_suggestion_when_the_words_match(self):
        self.assertIsNone(self.search('mug').data['did_you_mean'])

    def test_nonsense_finds_nothing_and_suggests_nothing(self):
        response = self.search('xqzvw')
        self.assertEqual(response.data['count'], 0)
        self.assertIsNone(response.data['did_you_mean'])

    def test_minus_leaves_words_out(self):
        self.assertEqual(self.names(self.search('knife -chef')), ['Bamboo Cutting Board'])

    def test_a_chosen_sort_beats_best_match(self):
        self.assertEqual(self.names(self.search('knife', ordering='price')), ['Bamboo Cutting Board', 'Chef Knife'])

    def test_best_match_sort_without_a_search_is_harmless(self):
        response = client_for().get('/api/products/', {'ordering': '-relevance'})
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('did_you_mean', response.data)  # only while searching
        self.assertIsNone(response.data['results'][0]['search_snippet'])

    def test_hidden_products_are_never_found(self):
        self.assertEqual(self.names(self.search('travel')), [])
        self.assertEqual(client_for().get('/api/products/suggest/', {'q': 'travel'}).data, [])

    def test_search_results_keep_their_ratings(self):
        result = self.search('mug').data['results'][0]
        self.assertEqual((result['review_count'], result['average_rating']), (0, None))

    def test_suggestions_while_typing(self):
        def suggestions(q):
            response = client_for().get('/api/products/suggest/', {'q': q})
            self.assertEqual(response.status_code, 200)
            return [product['name'] for product in response.data]

        self.assertEqual(suggestions('hea'), ['Noise-Cancelling Headphones'])
        self.assertEqual(suggestions('bluetoth')[0], 'Bluetooth Speaker')  # a typo still finds it first
        self.assertEqual(suggestions('b'), [])  # too short to be useful
        first = client_for().get('/api/products/suggest/', {'q': 'mug'}).data[0]
        self.assertEqual(set(first), {'id', 'name', 'slug', 'price', 'image', 'category'})

    def test_at_most_six_suggestions(self):
        kitchen = make_category('Garden')
        for number in range(8):
            make_product(kitchen, f'Plant Pot {number}')
        response = client_for().get('/api/products/suggest/', {'q': 'plant'})
        self.assertEqual(len(response.data), 6)


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

    def test_categories_show_their_product_count(self):
        make_category('Empty')
        response = client_for().get('/api/categories/')
        counts = {category['name']: category['product_count'] for category in response.data}
        self.assertEqual(counts, {'Empty': 0, 'Kitchen': 1})

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

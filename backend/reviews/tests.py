from unittest import mock

from rest_framework.test import APITestCase

from core.testing import client_for, make_category, make_product, make_user
from orders.models import Order

from .models import Review
from .views import NOT_DELIVERED

QUEUE_EMAIL = 'orders.services.send_order_email.delay'  # order emails are never really queued in tests
SHIPPING = {
    'full_name': 'Ana Silva', 'address': '1 Tea Street', 'city': 'Test City',
    'postal_code': '12345', 'country': 'Testland',
}


def buy(user, product, status=Order.Status.DELIVERED):
    """Order the product as `user` through the real checkout, then jump the order to `status`.
    (Walking through each status step is already tested in the orders app.)"""
    client = client_for(user)
    client.post('/api/cart/items/', {'product_id': product.id}, format='json')
    with mock.patch(QUEUE_EMAIL):
        order_id = client.post('/api/orders/checkout/', SHIPPING, format='json').data['id']
    Order.objects.filter(pk=order_id).update(status=status)


class ReviewTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mug = make_product(make_category('Kitchen'), 'Blue Mug')
        cls.ana = make_user('ana@example.com')
        cls.ana.first_name, cls.ana.last_name = 'Ana', 'silva'
        cls.ana.save()
        cls.bob = make_user('bob@example.com')
        buy(cls.ana, cls.mug)  # Ana has received the mug; Bob has not ordered it

    def setUp(self):
        self.url = f'/api/products/{self.mug.slug}/reviews/'
        self.me_url = f'{self.url}me/'

    def write(self, user, data):
        return client_for(user).post(self.url, data, format='json')

    def test_anonymous_visitors_cannot_write(self):
        self.assertEqual(client_for().post(self.url, {'rating': 5}, format='json').status_code, 401)

    def test_only_customers_with_a_delivered_order_may_review(self):
        response = self.write(self.bob, {'rating': 5})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], NOT_DELIVERED)

        buy(self.bob, self.mug, status=Order.Status.SHIPPED)  # on its way is not enough
        self.assertEqual(self.write(self.bob, {'rating': 5}).status_code, 403)

        response = self.write(self.ana, {'rating': 5, 'comment': '  Keeps my tea hot.  '})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['rating'], 5)
        self.assertEqual(response.data['comment'], 'Keeps my tea hot.')  # spaces trimmed
        self.assertEqual(response.data['author'], 'Ana S.')

    def test_one_review_per_customer_per_product(self):
        self.assertEqual(self.write(self.ana, {'rating': 5}).status_code, 201)
        response = self.write(self.ana, {'rating': 1})
        self.assertEqual(response.status_code, 400)
        self.assertIn('already reviewed', response.data['detail'])
        self.assertEqual(Review.objects.count(), 1)

    def test_rating_must_be_1_to_5_and_comment_is_optional(self):
        for bad in [{'rating': 0}, {'rating': 6}, {'comment': 'No stars'}]:
            response = self.write(self.ana, bad)
            self.assertEqual(response.status_code, 400)
            self.assertIn('rating', response.data)
        response = self.write(self.ana, {'rating': 4})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['comment'], '')

    def test_list_is_public_paginated_and_leaves_out_hidden_reviews(self):
        for number in range(6):
            Review.objects.create(product=self.mug, user=make_user(f'user{number}@example.com'), rating=4)
        Review.objects.create(product=self.mug, user=self.bob, rating=1, is_visible=False)

        response = client_for().get(self.url)  # anonymous
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 6)  # the hidden one is not counted
        self.assertEqual(len(response.data['results']), 5)  # 5 per page
        self.assertIsNotNone(response.data['next'])

    def test_author_is_a_public_name_never_the_email(self):
        Review.objects.create(product=self.mug, user=self.bob, rating=3)  # Bob has no first name
        response = client_for().get(self.url)
        self.assertEqual(response.data['results'][0]['author'], 'bob')
        self.assertNotIn('bob@example.com', response.content.decode())

    def test_my_review_can_be_read_changed_and_deleted(self):
        self.assertEqual(client_for(self.bob).get(self.me_url).data, {'can_review': False, 'review': None})
        ana = client_for(self.ana)
        self.assertEqual(ana.get(self.me_url).data, {'can_review': True, 'review': None})

        self.write(self.ana, {'rating': 3})
        self.assertEqual(ana.get(self.me_url).data['review']['rating'], 3)

        response = ana.patch(self.me_url, {'rating': 5, 'comment': 'Better than I thought'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Review.objects.get().rating, 5)

        self.assertEqual(ana.delete(self.me_url).status_code, 204)
        self.assertEqual(ana.get(self.me_url).data, {'can_review': True, 'review': None})  # may write a new one

    def test_nobody_can_change_someone_elses_review(self):
        self.write(self.ana, {'rating': 5})
        bob = client_for(self.bob)
        self.assertEqual(bob.patch(self.me_url, {'rating': 1}, format='json').status_code, 404)
        self.assertEqual(bob.delete(self.me_url).status_code, 404)
        self.assertEqual(Review.objects.get().rating, 5)
        self.assertEqual(client_for().get(self.me_url).status_code, 401)

    def test_hidden_review_is_still_shown_to_its_author_who_cannot_unhide_it(self):
        self.write(self.ana, {'rating': 2})
        Review.objects.update(is_visible=False)  # staff hid it in the Django admin
        ana = client_for(self.ana)

        ana.patch(self.me_url, {'is_visible': True, 'rating': 3}, format='json')

        self.assertFalse(ana.get(self.me_url).data['review']['is_visible'])
        self.assertEqual(client_for().get(self.url).data['count'], 0)

    def test_hidden_products_have_no_reviews_page_for_customers(self):
        self.mug.is_active = False
        self.mug.save()
        self.assertEqual(client_for().get(self.url).status_code, 404)
        self.assertEqual(client_for(self.ana).get(self.me_url).status_code, 404)


class ProductRatingTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        kitchen = make_category('Kitchen')
        cls.teapot = make_product(kitchen, 'Ceramic Teapot')
        cls.knife = make_product(kitchen, 'Chef Knife')
        cls.mug = make_product(kitchen, 'Blue Mug')  # no reviews
        users = [make_user(f'user{number}@example.com') for number in range(3)]
        Review.objects.create(product=cls.teapot, user=users[0], rating=5)
        Review.objects.create(product=cls.teapot, user=users[1], rating=4)
        Review.objects.create(product=cls.teapot, user=users[2], rating=1, is_visible=False)  # hidden: ignored
        Review.objects.create(product=cls.knife, user=users[0], rating=3)

    def test_products_show_their_average_rating_and_review_count(self):
        results = {p['slug']: p for p in client_for().get('/api/products/').data['results']}
        self.assertEqual((results['ceramic-teapot']['average_rating'], results['ceramic-teapot']['review_count']), (4.5, 2))
        self.assertEqual((results['chef-knife']['average_rating'], results['chef-knife']['review_count']), (3.0, 1))
        self.assertEqual((results['blue-mug']['average_rating'], results['blue-mug']['review_count']), (None, 0))

        detail = client_for().get('/api/products/ceramic-teapot/').data
        self.assertEqual((detail['average_rating'], detail['review_count']), (4.5, 2))

    def test_top_rated_first_and_unrated_last(self):
        response = client_for().get('/api/products/', {'ordering': '-rating'})
        names = [product['name'] for product in response.data['results']]
        self.assertEqual(names, ['Ceramic Teapot', 'Chef Knife', 'Blue Mug'])

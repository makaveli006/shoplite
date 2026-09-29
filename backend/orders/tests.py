import os
import threading
from decimal import Decimal
from unittest import mock

from django.core import mail
from django.db import connection
from django.test import TransactionTestCase
from rest_framework.test import APITestCase

from cart.models import CartItem
from catalog.models import Product
from core.testing import TemporaryMediaMixin, client_for, make_category, make_picture, make_product, make_user

from .models import Order
from .tasks import send_order_email

SHIPPING = {
    'full_name': 'Bob Builder', 'address': '5 Hammer Lane', 'city': 'Test City',
    'postal_code': '12345', 'country': 'Testland',
}

# In tests the order emails must never really be queued in Redis.
QUEUE_EMAIL = 'orders.services.send_order_email.delay'


def stock_of(product):
    return Product.objects.get(pk=product.pk).stock


class CheckoutTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        kitchen = make_category('Kitchen')
        cls.knife = make_product(kitchen, 'Chef Knife', '49.99', stock=5)
        cls.mug = make_product(kitchen, 'Blue Mug', '12.50', stock=20)
        cls.bob = make_user('bob@example.com')

    def setUp(self):
        self.client = client_for(self.bob)
        self.client.post('/api/cart/items/', {'product_id': self.knife.id, 'quantity': 2}, format='json')
        self.client.post('/api/cart/items/', {'product_id': self.mug.id, 'quantity': 3}, format='json')

    def checkout(self):
        return self.client.post('/api/orders/checkout/', SHIPPING, format='json')

    def test_checkout_creates_order_reduces_stock_empties_cart_and_queues_email(self):
        with mock.patch(QUEUE_EMAIL) as queue_email:
            # Run the "after the order is saved" actions that a real request would run.
            with self.captureOnCommitCallbacks(execute=True):
                response = self.checkout()

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['status'], 'pending')
        self.assertEqual(response.data['total_amount'], '137.48')
        self.assertEqual(stock_of(self.knife), 3)
        self.assertEqual(stock_of(self.mug), 17)
        self.assertFalse(CartItem.objects.filter(cart__user=self.bob).exists())
        queue_email.assert_called_once_with(response.data['id'], 'confirmation')

    def test_order_keeps_its_price_when_the_product_price_changes(self):
        with mock.patch(QUEUE_EMAIL):
            order_id = self.checkout().data['id']
        Product.objects.filter(pk=self.knife.pk).update(price=Decimal('99.00'))

        order = self.client.get(f'/api/orders/{order_id}/').data
        knife_line = next(line for line in order['items'] if line['product_name'] == 'Chef Knife')
        self.assertEqual(knife_line['unit_price'], '49.99')
        self.assertEqual(order['total_amount'], '137.48')

    def test_empty_cart_is_refused(self):
        self.client.delete('/api/cart/')
        response = self.checkout()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['problems'], ['Your cart is empty.'])

    def test_not_enough_stock_is_refused_and_nothing_changes(self):
        Product.objects.filter(pk=self.knife.pk).update(stock=1)

        response = self.checkout()

        self.assertEqual(response.status_code, 400)
        self.assertIn('Only 1 of "Chef Knife" in stock', response.data['problems'][0])
        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(stock_of(self.mug), 20)
        self.assertEqual(CartItem.objects.filter(cart__user=self.bob).count(), 2)

    def test_crash_halfway_leaves_nothing_behind(self):
        crash = mock.patch('orders.services.OrderItem.objects.bulk_create', side_effect=RuntimeError('crash'))
        with crash, self.assertRaises(RuntimeError):
            self.checkout()

        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(stock_of(self.knife), 5)
        self.assertEqual(stock_of(self.mug), 20)
        self.assertEqual(CartItem.objects.filter(cart__user=self.bob).count(), 2)


class OrderManagementTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.knife = make_product(make_category('Kitchen'), 'Chef Knife', '49.99', stock=5)
        cls.bob = make_user('bob@example.com')
        cls.ana = make_user('ana@example.com')
        cls.admin = make_user('admin@example.com', is_staff=True)

    def setUp(self):
        self.bob_client = client_for(self.bob)
        self.admin_client = client_for(self.admin)
        self.bob_client.post('/api/cart/items/', {'product_id': self.knife.id, 'quantity': 2}, format='json')
        with mock.patch(QUEUE_EMAIL):
            self.order_id = self.bob_client.post('/api/orders/checkout/', SHIPPING, format='json').data['id']

    def set_status(self, client, status):
        return client.patch(f'/api/orders/{self.order_id}/status/', {'status': status}, format='json')

    def test_customers_only_see_their_own_orders(self):
        self.assertEqual(self.bob_client.get('/api/orders/').data['count'], 1)
        ana_client = client_for(self.ana)
        self.assertEqual(ana_client.get('/api/orders/').data['count'], 0)
        self.assertEqual(ana_client.get(f'/api/orders/{self.order_id}/').status_code, 404)

    def test_cancel_returns_stock_once(self):
        self.assertEqual(stock_of(self.knife), 3)

        first = self.bob_client.post(f'/api/orders/{self.order_id}/cancel/')
        second = self.bob_client.post(f'/api/orders/{self.order_id}/cancel/')

        self.assertEqual(first.data['status'], 'cancelled')
        self.assertEqual(second.status_code, 400)
        self.assertEqual(stock_of(self.knife), 5)

    def test_customer_cannot_cancel_after_payment(self):
        self.set_status(self.admin_client, 'paid')
        response = self.bob_client.post(f'/api/orders/{self.order_id}/cancel/')
        self.assertEqual(response.status_code, 400)
        self.assertIn('can no longer be cancelled', response.data['detail'])

    def test_admin_follows_allowed_status_steps(self):
        self.assertEqual(self.set_status(self.admin_client, 'delivered').status_code, 400)  # can't skip
        for status in ['paid', 'shipped', 'delivered']:
            self.assertEqual(self.set_status(self.admin_client, status).status_code, 200)
        self.assertEqual(self.set_status(self.admin_client, 'cancelled').status_code, 400)  # final

    def test_customer_cannot_change_status(self):
        self.assertEqual(self.set_status(self.bob_client, 'paid').status_code, 403)

    def test_admin_can_filter_and_search_all_orders(self):
        self.assertEqual(self.admin_client.get('/api/orders/', {'status': 'pending'}).data['count'], 1)
        self.assertEqual(self.admin_client.get('/api/orders/', {'status': 'paid'}).data['count'], 0)
        self.assertEqual(self.admin_client.get('/api/orders/', {'search': 'bob@'}).data['count'], 1)
        self.assertEqual(self.admin_client.get('/api/orders/', {'search': 'ana@'}).data['count'], 0)


class OrderEmailTests(TemporaryMediaMixin, APITestCase):
    def setUp(self):
        self.kitchen = make_category('Kitchen')
        self.knife = make_product(self.kitchen, 'Chef Knife', '49.99')  # no picture

    def place_order(self, *products):
        client = client_for(make_user('bob@example.com'))
        for product in products:
            client.post('/api/cart/items/', {'product_id': product.id}, format='json')
        with mock.patch(QUEUE_EMAIL):
            return client.post('/api/orders/checkout/', SHIPPING, format='json').data['id']

    def test_confirmation_has_a_text_and_an_html_version(self):
        order_id = self.place_order(self.knife)

        # Run the job directly (no worker needed). In tests Django collects emails in mail.outbox.
        send_order_email(order_id, 'confirmation')

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.to, ['bob@example.com'])
        self.assertEqual(email.subject, f'Order #{order_id} confirmed')
        self.assertIn('1 x Chef Knife @ $49.99', email.body)
        html, mimetype = email.alternatives[0]
        self.assertEqual(mimetype, 'text/html')
        self.assertIn('Chef Knife', html)
        self.assertIn(f'/orders/{order_id}', html)  # the "View your order" button

    def test_product_pictures_travel_inside_the_email(self):
        teapot = make_product(self.kitchen, 'Ceramic Teapot', '27.50')
        teapot.image.save('teapot.png', make_picture())

        send_order_email(self.place_order(teapot, self.knife), 'confirmation')

        email = mail.outbox[0]
        html = email.alternatives[0][0]
        self.assertEqual(email.mixed_subtype, 'related')
        self.assertEqual([picture['Content-ID'] for picture in email.attachments], [f'<product-{teapot.pk}>'])
        self.assertIn(f'src="cid:product-{teapot.pk}"', html)
        self.assertIn('#a1a1aa;">C</td>', html)  # the knife has no picture: letter placeholder
        email.message().as_bytes()  # the complete message can be built

    def test_missing_picture_file_does_not_stop_the_email(self):
        teapot = make_product(self.kitchen, 'Ceramic Teapot', '27.50')
        teapot.image.save('teapot.png', make_picture())
        order_id = self.place_order(teapot)
        os.remove(teapot.image.path)

        with self.assertLogs('core.emails', 'WARNING'):
            send_order_email(order_id, 'confirmation')

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].attachments, [])


class StatusEmailTests(APITestCase):
    """Every status change except back to pending emails the customer, once, after it is saved."""

    @classmethod
    def setUpTestData(cls):
        cls.knife = make_product(make_category('Kitchen'), 'Chef Knife', '49.99', stock=5)
        cls.bob = make_user('bob@example.com')
        cls.admin = make_user('admin@example.com', is_staff=True)

    def setUp(self):
        self.bob_client = client_for(self.bob)
        self.admin_client = client_for(self.admin)
        self.bob_client.post('/api/cart/items/', {'product_id': self.knife.id}, format='json')
        with mock.patch(QUEUE_EMAIL):
            self.order_id = self.bob_client.post('/api/orders/checkout/', SHIPPING, format='json').data['id']

    def queued_email(self, change):
        """Make a change and return the email jobs it queued (after the database commit)."""
        with mock.patch(QUEUE_EMAIL) as queue_email, self.captureOnCommitCallbacks(execute=True):
            response = change()
        return response, queue_email.call_args_list

    def set_status(self, status):
        return self.admin_client.patch(f'/api/orders/{self.order_id}/status/', {'status': status}, format='json')

    def test_each_admin_step_queues_its_email(self):
        for status in ['paid', 'shipped', 'delivered']:
            response, calls = self.queued_email(lambda: self.set_status(status))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(calls, [mock.call(self.order_id, status, cancelled_by_customer=False)])

    def test_refused_change_queues_nothing(self):
        response, calls = self.queued_email(lambda: self.set_status('delivered'))  # can't skip steps
        self.assertEqual(response.status_code, 400)
        self.assertEqual(calls, [])

    def test_cancel_email_knows_who_cancelled(self):
        response, calls = self.queued_email(lambda: self.bob_client.post(f'/api/orders/{self.order_id}/cancel/'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(calls, [mock.call(self.order_id, 'cancelled', cancelled_by_customer=True)])

    def test_admin_cancel_email(self):
        _, calls = self.queued_email(lambda: self.set_status('cancelled'))
        self.assertEqual(calls, [mock.call(self.order_id, 'cancelled', cancelled_by_customer=False)])

    def test_each_email_has_its_subject_and_both_versions(self):
        subjects = {
            'paid': f'Payment received for order #{self.order_id}',
            'shipped': f'Your order #{self.order_id} has shipped',
            'delivered': f'Your order #{self.order_id} was delivered',
            'cancelled': f'Your order #{self.order_id} was cancelled',
        }
        for kind, subject in subjects.items():
            send_order_email(self.order_id, kind)  # run the job directly
            email = mail.outbox[-1]
            self.assertEqual(email.subject, subject)
            self.assertEqual(email.to, ['bob@example.com'])
            self.assertIn('Chef Knife', email.body)
            self.assertIn('Chef Knife', email.alternatives[0][0])

    def test_cancelled_wording_depends_on_who_cancelled(self):
        send_order_email(self.order_id, 'cancelled', cancelled_by_customer=True)
        send_order_email(self.order_id, 'cancelled')
        by_customer, by_shop = mail.outbox
        self.assertIn('As you asked', by_customer.body)
        self.assertIn('we had to cancel', by_shop.body)


class LastItemRaceTests(TransactionTestCase):
    """Two customers buy the last item at the same moment: exactly one may succeed.

    TransactionTestCase really saves to the (test) database, which is needed here
    because each customer's request runs in its own thread with its own connection.
    """

    def test_last_item_is_sold_only_once(self):
        product = make_product(make_category('Kitchen'), 'Cutting Board', '18.00', stock=1)
        customers = [make_user('bob@example.com'), make_user('ana@example.com')]
        for customer in customers:
            client_for(customer).post('/api/cart/items/', {'product_id': product.id}, format='json')

        barrier = threading.Barrier(len(customers))
        status_codes = []

        def place_order(customer):
            try:
                client = client_for(customer)
                barrier.wait()  # both press "Place order" at the same instant
                status_codes.append(client.post('/api/orders/checkout/', SHIPPING, format='json').status_code)
            finally:
                connection.close()

        with mock.patch(QUEUE_EMAIL):
            threads = [threading.Thread(target=place_order, args=(customer,)) for customer in customers]
            for thread in threads:
                thread.start()
            for thread in threads:
                thread.join()

        self.assertEqual(sorted(status_codes), [201, 400])
        self.assertEqual(stock_of(product), 0)
        self.assertEqual(Order.objects.count(), 1)

import hashlib
import hmac
from decimal import Decimal
from unittest import mock

from django.test import SimpleTestCase, override_settings
from rest_framework.test import APITestCase

from core.testing import client_for, make_category, make_product, make_user
from orders.models import Order

from .gateway import PaymentGatewayError
from .models import Payment
from .services import amount_in_paise

# Dummy keys: the tests never talk to Razorpay.
KEY_SECRET = 'test-key-secret'
PAYMENT_SETTINGS = {
    'RAZORPAY_KEY_ID': 'rzp_test_dummy',
    'RAZORPAY_KEY_SECRET': KEY_SECRET,
    'RAZORPAY_WEBHOOK_SECRET': 'test-webhook-secret',
    'PAYMENTS_ENABLED': True,
    'SHOP_CURRENCY': 'INR',
}
# The one function that calls Razorpay's servers is replaced by a fake in every test.
CREATE_RAZORPAY_ORDER = 'payments.gateway.create_razorpay_order'
RAZORPAY_ORDER = {'id': 'order_TEST1', 'amount': 4999, 'currency': 'INR', 'status': 'created'}
QUEUE_EMAIL = 'orders.services.send_order_email.delay'  # order emails are never really queued in tests
SHIPPING = {
    'full_name': 'Bob Builder', 'address': '5 Hammer Lane', 'city': 'Test City',
    'postal_code': '12345', 'country': 'Testland', 'phone': '9876543210',
}


def sign(razorpay_order_id, razorpay_payment_id, secret=KEY_SECRET):
    """What Razorpay's payment window does: sign "<order id>|<payment id>" with the key secret."""
    message = f'{razorpay_order_id}|{razorpay_payment_id}'.encode()
    return hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()


@override_settings(**PAYMENT_SETTINGS)
class PaymentTestCase(APITestCase):
    """Bob has a pending order for one Chef Knife (₹49.99)."""

    price = '49.99'

    @classmethod
    def setUpTestData(cls):
        cls.knife = make_product(make_category('Kitchen'), 'Chef Knife', cls.price, stock=5)
        cls.bob = make_user('bob@example.com')
        cls.ana = make_user('ana@example.com')

    def setUp(self):
        self.bob_client = client_for(self.bob)
        self.bob_client.post('/api/cart/items/', {'product_id': self.knife.id}, format='json')
        with mock.patch(QUEUE_EMAIL):
            self.order_id = self.bob_client.post('/api/orders/checkout/', SHIPPING, format='json').data['id']

    def start(self, client=None, **fake):
        """POST payments/start/ with Razorpay replaced by a fake. Returns (response, fake)."""
        with mock.patch(CREATE_RAZORPAY_ORDER, **(fake or {'return_value': RAZORPAY_ORDER})) as create:
            response = (client or self.bob_client).post('/api/payments/start/', {'order_id': self.order_id}, format='json')
        return response, create

    def set_order_status(self, status):
        Order.objects.filter(pk=self.order_id).update(status=status)


class StartPaymentTests(PaymentTestCase):
    def test_signed_out_visitors_cannot_start(self):
        response, create = self.start(client=client_for())
        self.assertEqual(response.status_code, 401)
        create.assert_not_called()

    def test_someone_elses_order_does_not_exist_for_me(self):
        response, create = self.start(client=client_for(self.ana))
        self.assertEqual(response.status_code, 404)
        create.assert_not_called()

    def test_gives_the_payment_window_everything_it_needs(self):
        response, create = self.start()

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data['key_id'], 'rzp_test_dummy')
        self.assertEqual(data['razorpay_order_id'], 'order_TEST1')
        self.assertEqual((data['amount'], data['currency']), (4999, 'INR'))  # ₹49.99 in paise
        self.assertEqual(data['description'], f'Order #{self.order_id}')
        self.assertEqual(data['prefill'], {'name': 'Bob Builder', 'email': 'bob@example.com', 'contact': '9876543210'})
        self.assertTrue(data['test_mode'])
        self.assertNotIn(KEY_SECRET, str(data))  # the secret never leaves the server
        create.assert_called_once()
        self.assertEqual(create.call_args.args[1], 4999)  # the amount comes from our database
        self.assertEqual(Payment.objects.get().status, Payment.Status.CREATED)

    def test_trying_again_reuses_the_razorpay_order(self):
        with mock.patch(CREATE_RAZORPAY_ORDER, return_value=RAZORPAY_ORDER) as create:
            first = self.bob_client.post('/api/payments/start/', {'order_id': self.order_id}, format='json')
            second = self.bob_client.post('/api/payments/start/', {'order_id': self.order_id}, format='json')

        self.assertEqual(first.data['razorpay_order_id'], second.data['razorpay_order_id'])
        create.assert_called_once()
        self.assertEqual(Payment.objects.count(), 1)

    def test_only_pending_orders_can_be_paid(self):
        for status in [Order.Status.PAID, Order.Status.CANCELLED]:
            self.set_order_status(status)
            response, create = self.start()
            self.assertEqual(response.status_code, 400)
            self.assertIn('can no longer be paid', response.data['detail'])
            create.assert_not_called()

    @override_settings(PAYMENTS_ENABLED=False)
    def test_without_keys_online_payment_is_switched_off(self):
        response, create = self.start()
        self.assertEqual(response.status_code, 503)
        create.assert_not_called()

    def test_razorpay_unreachable(self):
        response, _ = self.start(side_effect=PaymentGatewayError('connection refused'))
        self.assertEqual(response.status_code, 502)
        self.assertFalse(Payment.objects.exists())


class MinimumAmountTests(PaymentTestCase):
    price = '0.50'  # below Razorpay's minimum of ₹1

    def test_orders_below_one_rupee_cannot_be_paid_online(self):
        response, create = self.start()
        self.assertEqual(response.status_code, 400)
        self.assertIn('at least ₹1', response.data['detail'])
        create.assert_not_called()


class VerifyPaymentTests(PaymentTestCase):
    def setUp(self):
        super().setUp()
        self.start()  # Bob opened the payment window: a Payment for order_TEST1 exists

    def verify(self, client=None, signature=None, payment_id='pay_TEST1'):
        """POST payments/verify/ like the browser does after the payment window closes.
        Returns (response, the order emails queued after the database commit)."""
        receipt = {
            'razorpay_order_id': 'order_TEST1',
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature or sign('order_TEST1', payment_id),
        }
        with mock.patch(QUEUE_EMAIL) as queue_email, self.captureOnCommitCallbacks(execute=True):
            response = (client or self.bob_client).post('/api/payments/verify/', receipt, format='json')
        return response, queue_email.call_args_list

    def test_a_genuine_receipt_marks_the_order_paid_and_sends_one_email(self):
        response, emails = self.verify()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'paid')  # the full order comes back
        payment = Payment.objects.get()
        self.assertEqual(payment.status, Payment.Status.PAID)
        self.assertEqual(payment.razorpay_payment_id, 'pay_TEST1')
        self.assertEqual(payment.confirmed_via, Payment.ConfirmedVia.CHECKOUT)
        self.assertEqual(emails, [mock.call(self.order_id, 'paid', cancelled_by_customer=False)])

    def test_a_fake_receipt_is_refused(self):
        response, emails = self.verify(signature=sign('order_TEST1', 'pay_TEST1', secret='a-guessed-secret'))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.get(pk=self.order_id).status, Order.Status.PENDING)
        self.assertEqual(Payment.objects.get().status, Payment.Status.CREATED)
        self.assertEqual(emails, [])

    def test_someone_else_cannot_confirm_my_payment(self):
        response, _ = self.verify(client=client_for(self.ana))
        self.assertEqual(response.status_code, 404)

    def test_confirming_twice_changes_nothing_the_second_time(self):
        _, first_emails = self.verify()
        response, second_emails = self.verify()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(first_emails), 1)
        self.assertEqual(second_emails, [])  # no second "Payment received" email

    def test_paid_after_cancelling_keeps_the_order_cancelled_and_flags_a_refund(self):
        self.set_order_status(Order.Status.CANCELLED)

        with self.assertLogs('payments.services', 'ERROR') as logs:
            _, emails = self.verify()

        self.assertIn('refund it', logs.output[0])

        self.assertEqual(Order.objects.get(pk=self.order_id).status, Order.Status.CANCELLED)
        payment = Payment.objects.get()
        self.assertEqual(payment.status, Payment.Status.PAID)
        self.assertTrue(payment.needs_refund)
        self.assertEqual(emails, [])


class AmountInPaiseTests(SimpleTestCase):
    def test_rupees_become_exact_paise(self):
        self.assertEqual(amount_in_paise(Decimal('49.99')), 4999)
        self.assertEqual(amount_in_paise(Decimal('1')), 100)
        self.assertEqual(amount_in_paise(Decimal('1234.50')), 123450)
        self.assertEqual(amount_in_paise(Decimal('0.10')), 10)

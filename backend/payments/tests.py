import hashlib
import hmac
import json
from decimal import Decimal
from unittest import mock

from django.test import SimpleTestCase, override_settings
from rest_framework.test import APITestCase

from core.testing import client_for, make_category, make_product, make_user
from orders.models import Order

from .gateway import PaymentGatewayError
from .models import Payment, WebhookEvent
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
        with self.assertLogs('django.request', 'ERROR'):  # a 5xx answer is logged as an error
            response, create = self.start()
        self.assertEqual(response.status_code, 503)
        create.assert_not_called()

    def test_razorpay_unreachable(self):
        with self.assertLogs('django.request', 'ERROR'):  # a 5xx answer is logged as an error
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


def webhook_body(event, razorpay_order_id='order_TEST1', payment_id='pay_TEST1', amount=4999, **payment_fields):
    """A webhook body shaped like Razorpay's: the payment is at payload.payment.entity."""
    payment = {'id': payment_id, 'entity': 'payment', 'order_id': razorpay_order_id, 'amount': amount,
               'currency': 'INR', **payment_fields}
    return json.dumps({'entity': 'event', 'event': event, 'payload': {'payment': {'entity': payment}}}).encode()


class WebhookTests(PaymentTestCase):
    def setUp(self):
        super().setUp()
        self.start()  # Bob opened the payment window: a Payment for order_TEST1 exists

    def deliver(self, body, event_id='evt_1', signature=None):
        """What Razorpay's server does: POST the body, signed with the webhook secret.
        Returns (response, the order emails queued after the database commit)."""
        if signature is None:
            signature = hmac.new(PAYMENT_SETTINGS['RAZORPAY_WEBHOOK_SECRET'].encode(), body, hashlib.sha256).hexdigest()
        with mock.patch(QUEUE_EMAIL) as queue_email, self.captureOnCommitCallbacks(execute=True):
            response = client_for().post(  # no login: Razorpay proves itself with the signature
                '/api/payments/webhook/', data=body, content_type='application/json',
                HTTP_X_RAZORPAY_SIGNATURE=signature, HTTP_X_RAZORPAY_EVENT_ID=event_id,
            )
        return response, queue_email.call_args_list

    def order_status(self):
        return Order.objects.get(pk=self.order_id).status

    def test_payment_captured_marks_the_order_paid_and_sends_one_email(self):
        response, emails = self.deliver(webhook_body('payment.captured', status='captured'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.order_status(), Order.Status.PAID)
        payment = Payment.objects.get()
        self.assertEqual((payment.status, payment.razorpay_payment_id), (Payment.Status.PAID, 'pay_TEST1'))
        self.assertEqual(payment.confirmed_via, Payment.ConfirmedVia.WEBHOOK)
        self.assertEqual(emails, [mock.call(self.order_id, 'paid', cancelled_by_customer=False)])

    def test_order_paid_event_works_too(self):
        response, _ = self.deliver(webhook_body('order.paid'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.order_status(), Order.Status.PAID)

    def test_a_repeated_delivery_is_handled_only_once(self):
        body = webhook_body('payment.captured')
        _, first_emails = self.deliver(body, event_id='evt_same')
        response, second_emails = self.deliver(body, event_id='evt_same')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'already handled')
        self.assertEqual(WebhookEvent.objects.count(), 1)
        self.assertEqual((len(first_emails), second_emails), (1, []))

    def test_wrong_or_missing_signature_is_refused(self):
        for signature in ['not-the-right-signature', '']:
            with self.assertLogs('payments.views', 'WARNING'):
                response, emails = self.deliver(webhook_body('payment.captured'), signature=signature)
            self.assertEqual(response.status_code, 400)
        self.assertEqual(self.order_status(), Order.Status.PENDING)
        self.assertFalse(WebhookEvent.objects.exists())

    @override_settings(RAZORPAY_WEBHOOK_SECRET='')
    def test_without_a_webhook_secret_nothing_is_trusted(self):
        with self.assertLogs('payments.views', 'WARNING'):
            response, _ = self.deliver(webhook_body('payment.captured'), signature='anything')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.order_status(), Order.Status.PENDING)

    def test_a_different_amount_does_not_pay_the_order(self):
        with self.assertLogs('payments.services', 'ERROR'):
            response, emails = self.deliver(webhook_body('payment.captured', amount=100))

        self.assertEqual(response.status_code, 200)  # received; our side refuses it
        self.assertEqual(self.order_status(), Order.Status.PENDING)
        self.assertEqual(emails, [])

    def test_a_failed_payment_is_recorded_and_a_later_success_still_counts(self):
        self.deliver(webhook_body('payment.failed', payment_id='pay_FAIL', error_description='Card declined'),
                     event_id='evt_fail')

        payment = Payment.objects.get()
        self.assertEqual((payment.status, payment.error_description), (Payment.Status.FAILED, 'Card declined'))
        self.assertEqual(self.order_status(), Order.Status.PENDING)  # the customer can try again

        self.deliver(webhook_body('payment.captured'), event_id='evt_ok')
        self.assertEqual(self.order_status(), Order.Status.PAID)

    def test_events_for_unknown_orders_are_acknowledged_and_ignored(self):
        with self.assertLogs('payments.services', 'WARNING'):
            response, emails = self.deliver(webhook_body('payment.captured', razorpay_order_id='order_NOT_OURS'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.order_status(), Order.Status.PENDING)
        self.assertEqual(emails, [])

    def test_other_events_are_acknowledged(self):
        response, _ = self.deliver(webhook_body('refund.processed'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.order_status(), Order.Status.PENDING)

    def test_browser_first_then_webhook_sends_one_email_in_total(self):
        receipt = {'razorpay_order_id': 'order_TEST1', 'razorpay_payment_id': 'pay_TEST1',
                   'razorpay_signature': sign('order_TEST1', 'pay_TEST1')}
        with mock.patch(QUEUE_EMAIL) as checkout_emails, self.captureOnCommitCallbacks(execute=True):
            self.bob_client.post('/api/payments/verify/', receipt, format='json')

        response, webhook_emails = self.deliver(webhook_body('payment.captured'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(checkout_emails.call_args_list), 1)
        self.assertEqual(webhook_emails, [])  # the webhook found it already paid
        self.assertEqual(Payment.objects.get().confirmed_via, Payment.ConfirmedVia.CHECKOUT)


class AmountInPaiseTests(SimpleTestCase):
    def test_rupees_become_exact_paise(self):
        self.assertEqual(amount_in_paise(Decimal('49.99')), 4999)
        self.assertEqual(amount_in_paise(Decimal('1')), 100)
        self.assertEqual(amount_in_paise(Decimal('1234.50')), 123450)
        self.assertEqual(amount_in_paise(Decimal('0.10')), 10)

import re
from unittest import mock

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.core.cache import cache
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APITestCase

from core.testing import PASSWORD, client_for, make_user

from .models import User
from .tasks import send_password_reset_email


class RegisterTests(APITestCase):
    def test_register_creates_customer_with_hashed_password(self):
        response = client_for().post('/api/auth/register/', {
            'email': '  Ana.Silva@Example.COM ',
            'username': 'ana',
            'password': PASSWORD,
            'is_staff': True,  # must be ignored
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertNotIn('password', response.data)
        user = User.objects.get(username='ana')
        self.assertEqual(user.email, 'ana.silva@example.com')
        self.assertFalse(user.is_staff)
        self.assertNotEqual(user.password, PASSWORD)
        self.assertTrue(user.check_password(PASSWORD))

    def test_weak_password_is_rejected(self):
        response = client_for().post('/api/auth/register/', {
            'email': 'ana@example.com', 'username': 'ana', 'password': '123',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.data)

    def test_email_must_be_unique_ignoring_case(self):
        make_user('customer@example.com')
        response = client_for().post('/api/auth/register/', {
            'email': 'CUSTOMER@example.com', 'username': 'someone', 'password': PASSWORD,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.data)


class LoginAndMeTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user('ana@example.com')

    def login(self, email, password):
        return client_for().post('/api/auth/token/', {'email': email, 'password': password}, format='json')

    def test_login_ignores_email_case_and_returns_tokens(self):
        response = self.login('ANA@Example.com', PASSWORD)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_wrong_password_is_rejected(self):
        self.assertEqual(self.login('ana@example.com', 'wrong').status_code, 401)

    def test_real_token_gives_access_to_me(self):
        token = self.login('ana@example.com', PASSWORD).data['access']
        client = client_for()
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'ana@example.com')

    def test_me_requires_login(self):
        self.assertEqual(client_for().get('/api/auth/me/').status_code, 401)

    def test_me_cannot_change_role_or_email(self):
        response = client_for(self.user).patch('/api/auth/me/', {
            'last_name': 'Silva', 'is_staff': True, 'email': 'hacker@example.com',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.last_name, 'Silva')
        self.assertFalse(self.user.is_staff)
        self.assertEqual(self.user.email, 'ana@example.com')


# In tests the reset email must never really be queued in Redis.
QUEUE_RESET_EMAIL = 'accounts.views.send_password_reset_email.delay'
NEW_PASSWORD = 'Brand-New-Garden-77'


class PasswordResetTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user('ana@example.com')

    def setUp(self):
        cache.clear()  # the request limit (5 per hour) is counted in the cache

    def request_reset(self, email):
        return client_for().post('/api/auth/password-reset/', {'email': email}, format='json')

    def confirm(self, uid, token, password=NEW_PASSWORD):
        return client_for().post(
            '/api/auth/password-reset/confirm/',
            {'uid': uid, 'token': token, 'new_password': password},
            format='json',
        )

    def valid_link_parts(self):
        return urlsafe_base64_encode(force_bytes(self.user.pk)), default_token_generator.make_token(self.user)

    def test_request_queues_an_email_for_an_existing_account(self):
        with mock.patch(QUEUE_RESET_EMAIL) as queue_email:
            response = self.request_reset('ANA@example.com')
        self.assertEqual(response.status_code, 200)
        queue_email.assert_called_once()
        user_id, link = queue_email.call_args.args
        self.assertEqual(user_id, self.user.pk)
        self.assertTrue(link.startswith(f'{settings.FRONTEND_URL}/reset-password/'))

    def test_unknown_email_gets_the_same_answer_and_no_email(self):
        with mock.patch(QUEUE_RESET_EMAIL) as queue_email:
            known = self.request_reset('ana@example.com')
            unknown = self.request_reset('nobody@example.com')
        self.assertEqual(unknown.status_code, 200)
        self.assertEqual(unknown.data, known.data)
        queue_email.assert_called_once()  # only for the known account

    def test_requests_are_limited(self):
        with mock.patch(QUEUE_RESET_EMAIL):
            codes = [self.request_reset('ana@example.com').status_code for _ in range(6)]
        self.assertEqual(codes, [200, 200, 200, 200, 200, 429])

    def test_email_contains_a_working_link(self):
        with mock.patch(QUEUE_RESET_EMAIL) as queue_email:
            self.request_reset('ana@example.com')
        send_password_reset_email(*queue_email.call_args.args)  # run the job directly, no worker needed

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.to, ['ana@example.com'])
        self.assertEqual(email.subject, 'Reset your ShopLite password')
        # The same link is in the HTML version, behind the button.
        link = queue_email.call_args.args[1]
        html, mimetype = email.alternatives[0]
        self.assertEqual(mimetype, 'text/html')
        self.assertIn(f'href="{link}"', html)
        self.assertIn('Choose a new password', html)

        uid, token = re.search(r'/reset-password/([^/\s]+)/([^/\s]+)', email.body).groups()
        self.assertEqual(self.confirm(uid, token).status_code, 200)

    def test_new_password_works_and_link_only_works_once(self):
        uid, token = self.valid_link_parts()

        self.assertEqual(self.confirm(uid, token).status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(NEW_PASSWORD))
        # Changing the password invalidates the link.
        self.assertEqual(self.confirm(uid, token, 'Another-Garden-88').status_code, 400)

    def test_invalid_link_is_refused(self):
        uid, _ = self.valid_link_parts()
        response = self.confirm(uid, 'not-a-real-token')
        self.assertEqual(response.status_code, 400)
        self.assertIn('invalid or has expired', response.data['token'][0])
        self.assertEqual(self.confirm('garbage', 'garbage').status_code, 400)

    def test_weak_new_password_is_refused(self):
        uid, token = self.valid_link_parts()
        response = self.confirm(uid, token, '123')
        self.assertEqual(response.status_code, 400)
        self.assertIn('new_password', response.data)

from rest_framework.test import APITestCase

from core.testing import PASSWORD, client_for, make_user

from .models import User


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

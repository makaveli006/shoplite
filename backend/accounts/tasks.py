from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model

from core.emails import send_email


@shared_task(autoretry_for=(OSError,), retry_backoff=True, max_retries=5)
def send_password_reset_email(user_id, link):
    """Email a one-time link to choose a new password. Runs in the Celery worker.

    The link is made by the web server (see accounts/views.py), which also checks it later.
    """
    user = get_user_model().objects.get(pk=user_id)
    send_email(
        to=user.email,
        subject='Reset your ShopLite password',
        template='password_reset',
        context={'user': user, 'link': link, 'minutes': settings.PASSWORD_RESET_TIMEOUT // 60},
    )
    return f'Password reset link sent to {user.email}'

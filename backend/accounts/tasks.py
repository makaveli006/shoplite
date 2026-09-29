from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail


@shared_task(autoretry_for=(OSError,), retry_backoff=True, max_retries=5)
def send_password_reset_email(user_id, link):
    """Email a one-time link to choose a new password. Runs in the Celery worker.

    The link is made by the web server (see accounts/views.py), which also checks it later.
    """
    user = get_user_model().objects.get(pk=user_id)
    minutes = settings.PASSWORD_RESET_TIMEOUT // 60

    send_mail(
        subject='Reset your ShopLite password',
        message='\n'.join([
            f'Hi {user.first_name or user.username},',
            '',
            'Someone (hopefully you) asked to reset the password of your ShopLite account.',
            'Open this link to choose a new password:',
            '',
            f'  {link}',
            '',
            f'The link works once and expires in {minutes} minutes.',
            "If you didn't ask for this, you can ignore this email: your password stays the same.",
            '',
            'ShopLite',
        ]),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
    return f'Password reset link sent to {user.email}'

"""The only place that talks to Razorpay. Everything else uses these functions, so tests can
replace them and the rest of the shop never needs to know Razorpay's details."""

import hashlib
import hmac

import razorpay
import requests
from django.conf import settings
from razorpay.errors import BadRequestError, GatewayError, ServerError

TIMEOUT_SECONDS = 10  # don't let a slow Razorpay keep the customer's request waiting forever


class PaymentGatewayError(Exception):
    """Razorpay could not be reached, or refused the request."""


def client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def create_razorpay_order(order, amount):
    """Ask Razorpay to open an "order" for this amount (in paise). Returns Razorpay's answer,
    e.g. {"id": "order_Nx...", "amount": 4999, "currency": "INR", "status": "created", ...}."""
    try:
        return client().order.create(
            {
                'amount': amount,
                'currency': settings.SHOP_CURRENCY,
                'receipt': f'order_{order.pk}',  # our order number, shown in the Razorpay Dashboard
                'notes': {'shoplite_order_id': str(order.pk)},
            },
            timeout=TIMEOUT_SECONDS,
        )
    except (
        BadRequestError,
        GatewayError,
        ServerError,
        requests.exceptions.RequestException,
        ValueError,  # an answer that isn't JSON
    ) as error:
        raise PaymentGatewayError(str(error) or error.__class__.__name__) from error


def _hmac_matches(message, secret, signature):
    """Recalculate the signature with our secret and compare it with the one we received.
    compare_digest takes the same time however many characters match, so an attacker
    can't guess a valid signature by measuring response times."""
    if not (secret and signature):
        return False
    expected = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def payment_signature_is_valid(razorpay_order_id, razorpay_payment_id, signature):
    """The payment window's receipt is signed by Razorpay with our key secret:
    HMAC-SHA256("<order id>|<payment id>"). Only Razorpay (and we) can produce it."""
    message = f'{razorpay_order_id}|{razorpay_payment_id}'.encode()
    return _hmac_matches(message, settings.RAZORPAY_KEY_SECRET, signature)


def webhook_signature_is_valid(raw_body, signature):
    """Webhooks are signed with the webhook secret over the exact bytes Razorpay sent,
    so the check must use the raw request body, before anything parses it."""
    return _hmac_matches(raw_body, settings.RAZORPAY_WEBHOOK_SECRET, signature)

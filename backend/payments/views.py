import json
import logging

from django.conf import settings
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.views import order_response

from . import gateway
from .models import Payment, WebhookEvent
from .services import PaymentError, mark_failed, mark_paid, start_payment

logger = logging.getLogger(__name__)


class StartPaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()


class VerifyPaymentSerializer(serializers.Serializer):
    """What the Razorpay payment window hands the browser after a successful payment."""

    razorpay_order_id = serializers.CharField(max_length=50)
    razorpay_payment_id = serializers.CharField(max_length=50)
    razorpay_signature = serializers.CharField(max_length=200)


class StartPaymentView(APIView):
    """
    POST /api/payments/start/  {"order_id": 15}

    Everything the browser needs to open the Razorpay payment window for MY pending order.
    The amount comes from our database, never from the browser.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Someone else's order doesn't exist for me (404), like everywhere else in the API.
        order = get_object_or_404(Order, pk=serializer.validated_data['order_id'], user=request.user)

        if not settings.PAYMENTS_ENABLED:
            return Response(
                {'detail': 'Online payment is not set up for this shop yet.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        try:
            payment = start_payment(order)
        except PaymentError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        except gateway.PaymentGatewayError:
            return Response(
                {'detail': "We couldn't reach the payment service. Please try again in a moment."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            'key_id': settings.RAZORPAY_KEY_ID,  # public: identifies the shop to Razorpay
            'razorpay_order_id': payment.razorpay_order_id,
            'amount': payment.amount,  # in paise
            'currency': payment.currency,
            'name': 'ShopLite',
            'description': f'Order #{order.pk}',
            # Fills in the payment window's form, so the customer types less.
            'prefill': {'name': order.full_name, 'email': request.user.email, 'contact': order.phone},
            'test_mode': settings.RAZORPAY_KEY_ID.startswith('rzp_test_'),
        })


class VerifyPaymentView(APIView):
    """
    POST /api/payments/verify/  {"razorpay_order_id", "razorpay_payment_id", "razorpay_signature"}

    The browser forwards the payment window's receipt. We only believe it if the signature
    matches our secret key: a made-up "I paid" is refused. Returns the (now paid) order.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        payment = get_object_or_404(
            Payment.objects.select_related('order'),
            razorpay_order_id=data['razorpay_order_id'],
            order__user=request.user,
        )

        if not gateway.payment_signature_is_valid(
            data['razorpay_order_id'], data['razorpay_payment_id'], data['razorpay_signature'],
        ):
            return Response(
                {'detail': "We couldn't confirm this payment. If money was taken, it will be confirmed shortly."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        mark_paid(data['razorpay_order_id'], data['razorpay_payment_id'], via=Payment.ConfirmedVia.CHECKOUT)
        return order_response(request, payment.order_id)


class RazorpayWebhookView(APIView):
    """
    POST /api/payments/webhook/   called by Razorpay's servers, not by a browser.

    Tells us about payments even when the customer closed the tab or lost their internet
    right after paying. Every request is signed with the webhook secret, so nobody else can
    pretend to be Razorpay. Answering 200 tells Razorpay "received, don't send it again".
    """

    permission_classes = [AllowAny]  # Razorpay has no login here; the signature proves who it is
    authentication_classes = []  # no JWT or session, which also means no CSRF check

    def post(self, request):
        # The signature covers the exact bytes Razorpay sent: check it BEFORE reading them as JSON.
        raw_body = request.body
        if not gateway.webhook_signature_is_valid(raw_body, request.headers.get('X-Razorpay-Signature', '')):
            logger.warning('Razorpay webhook with a missing or wrong signature was refused.')
            return Response({'detail': 'Invalid signature.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = json.loads(raw_body)
        except ValueError:
            return Response({'detail': 'The body is not JSON.'}, status=status.HTTP_400_BAD_REQUEST)

        event = payload.get('event', '')
        event_id = request.headers.get('X-Razorpay-Event-Id', '')
        # All or nothing: if handling fails, the event is not recorded either, so Razorpay's
        # next delivery of it gets a fresh try.
        with transaction.atomic():
            if event_id:
                try:
                    with transaction.atomic():
                        # Razorpay may deliver the same event more than once: the unique event
                        # id makes a repeated delivery fail here, and it's skipped.
                        WebhookEvent.objects.create(event_id=event_id, event=event)
                except IntegrityError:
                    return Response({'status': 'already handled'})
            self.handle(event, payload.get('payload', {}))
        return Response({'status': 'ok'})

    def handle(self, event, payload):
        payment = payload.get('payment', {}).get('entity', {})
        razorpay_order_id = payment.get('order_id') or payload.get('order', {}).get('entity', {}).get('id')
        if not razorpay_order_id:
            return  # an event without an order: nothing of ours

        if event in ('payment.captured', 'order.paid'):
            mark_paid(razorpay_order_id, payment.get('id', ''), via=Payment.ConfirmedVia.WEBHOOK,
                      amount=payment.get('amount'))
        elif event == 'payment.failed':
            mark_failed(razorpay_order_id, payment.get('id', ''), payment.get('error_description', ''))
        # Any other event: acknowledged with 200 and otherwise ignored.

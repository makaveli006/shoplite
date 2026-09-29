from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.views import order_response

from . import gateway
from .models import Payment
from .services import PaymentError, mark_paid, start_payment


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

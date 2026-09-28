from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer, ShippingSerializer
from .services import CheckoutError, place_order


class CheckoutView(APIView):
    """POST /api/orders/checkout/ {shipping address} -> 201 with the new order, or 400 with problems."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipping = ShippingSerializer(data=request.data)
        shipping.is_valid(raise_exception=True)
        try:
            order = place_order(request.user, shipping.validated_data)
        except CheckoutError as error:
            return Response(
                {'detail': 'Checkout failed.', 'problems': error.problems},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order = Order.objects.prefetch_related('items__product').get(pk=order.pk)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

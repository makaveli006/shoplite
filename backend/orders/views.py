from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer, OrderStatusSerializer, ShippingSerializer
from .services import CheckoutError, OrderStatusError, change_status, place_order


def order_response(request, order_id, status_code=status.HTTP_200_OK):
    """Answer with the full, freshly loaded order."""
    order = Order.objects.select_related('user').prefetch_related('items__product').get(pk=order_id)
    return Response(OrderSerializer(order, context={'request': request}).data, status=status_code)


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
        return order_response(request, order.pk, status.HTTP_201_CREATED)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET   /api/orders/               my orders (admins: all orders)   ?status=pending  ?search=ana  ?ordering=-total_amount
    GET   /api/orders/<id>/          one order
    POST  /api/orders/<id>/cancel/   cancel my pending order (stock is returned)
    PATCH /api/orders/<id>/status/   admins: {"status": "paid" | "shipped" | "delivered" | "cancelled"}
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_value_regex = r'\d+'  # ids are numbers, so "checkout" is never mistaken for an order id
    filterset_fields = ['status']
    # ?search=ana -> matches the customer's email or the shipping name (useful for staff)
    search_fields = ['user__email', 'full_name']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Order.objects.select_related('user').prefetch_related('items__product')
        if self.request.user.is_staff:
            return queryset
        # Customers only ever see their own orders; anyone else's id gives 404.
        return queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()  # 404 if it isn't yours
        try:
            change_status(order.pk, Order.Status.CANCELLED, customer=request.user)
        except OrderStatusError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        return order_response(request, order.pk)

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def set_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            change_status(order.pk, serializer.validated_data['status'])
        except OrderStatusError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        return order_response(request, order.pk)

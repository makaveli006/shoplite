from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import AddCartItemSerializer, CartSerializer, UpdateCartItemSerializer


def get_cart(user):
    """The user's cart, created automatically the first time it's needed."""
    cart, _created = Cart.objects.get_or_create(user=user)
    return cart


def cart_response(request, status_code=status.HTTP_200_OK):
    """Every cart endpoint answers with the whole, up-to-date cart.

    That way the frontend can simply replace what it shows after any change.
    prefetch_related loads all items and their products in one extra query (no N+1).
    """
    cart = Cart.objects.prefetch_related('items__product').get(user=request.user)
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data, status=status_code)


def touch(cart):
    """Mark the cart as changed (updates Cart.updated_at)."""
    cart.save(update_fields=['updated_at'])


class CartView(APIView):
    """GET /api/cart/ -> my cart.   DELETE /api/cart/ -> empty my cart."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        get_cart(request.user)
        return cart_response(request)

    def delete(self, request):
        cart = get_cart(request.user)
        cart.items.all().delete()
        touch(cart)
        return cart_response(request)


class CartItemListView(APIView):
    """POST /api/cart/items/ {"product_id": 7, "quantity": 2} -> add to my cart."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_cart(request.user)
        serializer = AddCartItemSerializer(data=request.data, context={'cart': cart})
        serializer.is_valid(raise_exception=True)  # invalid -> 400 with the error messages
        serializer.save()
        touch(cart)
        # 201 when a new line was created, 200 when an existing line's quantity went up.
        return cart_response(request, status.HTTP_201_CREATED if serializer.created else status.HTTP_200_OK)


class CartItemDetailView(APIView):
    """PATCH /api/cart/items/<id>/ {"quantity": 3}.   DELETE /api/cart/items/<id>/."""

    permission_classes = [IsAuthenticated]

    def get_item(self, request, pk):
        # Only look inside MY cart: another customer's item id gives 404, not their data.
        return get_object_or_404(CartItem.objects.select_related('product'), pk=pk, cart__user=request.user)

    def patch(self, request, pk):
        item = self.get_item(request, pk)
        serializer = UpdateCartItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        touch(item.cart)
        return cart_response(request)

    def delete(self, request, pk):
        item = self.get_item(request, pk)
        cart = item.cart
        item.delete()
        touch(cart)
        return cart_response(request)

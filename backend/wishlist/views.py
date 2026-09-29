from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import WishlistItem
from .serializers import AddWishlistItemSerializer, WishlistItemSerializer


class WishlistView(APIView):
    """
    GET  /api/wishlist/   my saved products, newest first (a plain list: a wishlist is small,
                          and the frontend needs every saved product id to draw the hearts)
    POST /api/wishlist/   {"product_id": 7} -> 201 saved, or 200 if it already was
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related('product')
        return Response(WishlistItemSerializer(items, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = AddWishlistItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        try:
            # Saving something that is already saved is not an error (double click, two tabs).
            with transaction.atomic():
                item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        except IntegrityError:
            # Two saves at the same instant: the database's unique rule refused the second one.
            item, created = WishlistItem.objects.get(user=request.user, product=product), False
        data = WishlistItemSerializer(item, context={'request': request}).data
        return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class WishlistItemView(APIView):
    """
    DELETE /api/wishlist/<product_id>/   take that product off MY wishlist -> 204

    Addressed by product id, because the heart button knows the product, not the wishlist row.
    Always 204, even if it wasn't saved: the result ("not in my wishlist") is the same.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        WishlistItem.objects.filter(user=request.user, product_id=product_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from core.pagination import StandardPagination

from .models import Review
from .serializers import ReviewSerializer
from .services import can_review

ALREADY_REVIEWED = 'You have already reviewed this product. You can edit your review instead.'
NOT_DELIVERED = 'You can review this product after an order with it has been delivered.'


def get_product(request, slug):
    """The product from the URL. Hidden products don't exist for customers (404), like in the catalog."""
    products = Product.objects.all() if request.user.is_staff else Product.objects.filter(is_active=True)
    return get_object_or_404(products, slug=slug)


class ReviewPagination(StandardPagination):
    page_size = 5


class ProductReviewListView(generics.ListCreateAPIView):
    """
    GET  /api/products/<slug>/reviews/   the product's visible reviews, newest first (anyone)
    POST /api/products/<slug>/reviews/   write a review (signed in, with a delivered order)
    """

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ReviewPagination
    filter_backends = []  # no ?search= or ?ordering= here: always newest first

    def get_queryset(self):
        product = get_product(self.request, self.kwargs['slug'])
        return Review.objects.filter(product=product, is_visible=True).select_related('user')

    def create(self, request, *args, **kwargs):
        product = get_product(request, kwargs['slug'])
        if not can_review(request.user, product):
            return Response({'detail': NOT_DELIVERED}, status=status.HTTP_403_FORBIDDEN)
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({'detail': ALREADY_REVIEWED}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            # Safety net for two submits at the same moment: the database's
            # one-review-per-customer rule refuses the second one.
            with transaction.atomic():
                serializer.save(user=request.user, product=product)
        except IntegrityError:
            return Response({'detail': ALREADY_REVIEWED}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyReviewView(APIView):
    """
    GET    /api/products/<slug>/reviews/me/   {"can_review": bool, "review": {...} or null}
    PATCH  /api/products/<slug>/reviews/me/   change my review
    DELETE /api/products/<slug>/reviews/me/   delete my review

    "me" means the signed-in customer, so nobody can reach someone else's review here.
    """

    permission_classes = [IsAuthenticated]

    def get_my_review(self, product):
        return Review.objects.filter(user=self.request.user, product=product).select_related('user').first()

    def get(self, request, slug):
        product = get_product(request, slug)
        review = self.get_my_review(product)
        return Response({
            'can_review': can_review(request.user, product),
            # My own review is shown to me even when staff have hidden it (is_visible: false).
            'review': ReviewSerializer(review).data if review else None,
        })

    def patch(self, request, slug):
        review = self.get_my_review(get_product(request, slug))
        if review is None:
            return Response({'detail': 'You have not reviewed this product.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, slug):
        review = self.get_my_review(get_product(request, slug))
        if review is None:
            return Response({'detail': 'You have not reviewed this product.'}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

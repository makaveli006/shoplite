from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """A review as the shop shows it. The rating must be 1-5 and the comment at most
    2000 characters: DRF reads both rules from the model fields."""

    # A public name like "Ana S.": reviews are public, so never the email address.
    author = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'author', 'is_visible', 'created_at', 'updated_at']
        read_only_fields = ['is_visible']  # only staff change this, in the Django admin

    def get_author(self, review):
        user = review.user
        if not user.first_name:
            return user.username
        initial = f' {user.last_name[0].upper()}.' if user.last_name else ''
        return f'{user.first_name}{initial}'

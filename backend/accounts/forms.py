from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


# Django's built-in user forms are tied to its default User model.
# The docs say to extend them so they point at our custom model.

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username')


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User

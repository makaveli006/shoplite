from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Reuse Django's full user admin (password change, permissions, groups...),
    adjusted for our model where email is the login field."""

    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    # Fields shown on the "Add user" page.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

    list_display = ('email', 'username', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

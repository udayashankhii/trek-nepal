# admin_api/auth_serializers.py
from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

try:
    from rest_framework_simplejwt.tokens import RefreshToken
except Exception:  # pragma: no cover
    RefreshToken = None  # type: ignore

User = get_user_model()


class AdminLoginSerializer(serializers.Serializer):
    """Industry-grade Admin login serializer.

    - Accepts `email` + `password` (also accepts `username` as fallback).
    - Validates password using Django's hashing (`check_password`).
    - Allows ONLY staff users to login.
    - Returns JWT `access` + `refresh` plus a minimal admin profile.
    """

    email = serializers.EmailField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if RefreshToken is None:
            raise serializers.ValidationError(
                {"detail": "JWT not installed. Add 'djangorestframework-simplejwt' to your backend."}
            )

        identifier = (attrs.get("email") or "").strip()
        username = (attrs.get("username") or "").strip()
        password = attrs.get("password")

        if not identifier and not username:
            raise serializers.ValidationError({"detail": "Email or username is required."})

        # Try email first (professional admin login UX), then username.
        user = None
        if identifier:
            # Support custom user models that may not enforce unique email.
            qs = User.objects.filter(email__iexact=identifier)
            user = qs.first()

        if user is None and username:
            try:
                # Default Django user uses username field
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                user = None

        if user is None:
            raise serializers.ValidationError({"detail": "Invalid credentials."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Account is disabled."})

        # Validate password securely
        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Invalid credentials."})

        # Restrict to staff (admin panel)
        if not getattr(user, "is_staff", False):
            raise serializers.ValidationError({"detail": "Not allowed. Staff only."})

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            "access": str(access),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": getattr(user, "email", "") or "",
                "username": getattr(user, "username", "") or "",
                "is_staff": bool(getattr(user, "is_staff", False)),
                "is_superuser": bool(getattr(user, "is_superuser", False)),
            },
        }

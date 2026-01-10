# admin_api/auth_views.py
from __future__ import annotations

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle

try:
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from rest_framework_simplejwt.tokens import RefreshToken
    from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
except Exception:  # pragma: no cover
    JWTAuthentication = None  # type: ignore
    RefreshToken = None  # type: ignore
    TokenRefreshView = None  # type: ignore
    TokenVerifyView = None  # type: ignore

from admin_api.permissions import IsStaff
from .auth_serializers import AdminLoginSerializer


class AdminLoginView(APIView):
    """POST /api/admin/auth/login/

    Request:
      { "email": "...", "password": "..." }
      (username supported as fallback)

    Response:
      { "access": "...", "refresh": "...", "user": {...} }
    """

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "admin_login"

    def post(self, request, *args, **kwargs):
        ser = AdminLoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        return Response(ser.validated_data, status=status.HTTP_200_OK)


class AdminMeView(APIView):
    """GET /api/admin/auth/me/

    Returns the current admin profile. Useful for frontend re-hydration on refresh.
    """

    authentication_classes = [] if JWTAuthentication is None else [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, *args, **kwargs):
        u = request.user
        return Response(
            {
                "id": u.id,
                "email": getattr(u, "email", "") or "",
                "username": getattr(u, "username", "") or "",
                "is_staff": bool(getattr(u, "is_staff", False)),
                "is_superuser": bool(getattr(u, "is_superuser", False)),
            },
            status=status.HTTP_200_OK,
        )


class AdminLogoutView(APIView):
    """POST /api/admin/auth/logout/

    Blacklists refresh token (if token_blacklist is installed).
    Body: { "refresh": "<token>" }
    """

    authentication_classes = [] if JWTAuthentication is None else [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsStaff]

    def post(self, request, *args, **kwargs):
        if RefreshToken is None:
            return Response(
                {"ok": True, "note": "JWT/blacklist not installed; logout is client-side only."},
                status=status.HTTP_200_OK,
            )

        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh)
            # requires token_blacklist app; if not installed, blacklist() raises
            try:
                token.blacklist()
            except Exception:
                # graceful fallback
                pass
            return Response({"ok": True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)


# Expose SimpleJWT refresh/verify as admin namespaced routes (optional but professional)
class AdminTokenRefreshView(TokenRefreshView if TokenRefreshView is not None else APIView):  # type: ignore
    permission_classes = [AllowAny]


class AdminTokenVerifyView(TokenVerifyView if TokenVerifyView is not None else APIView):  # type: ignore
    permission_classes = [AllowAny]

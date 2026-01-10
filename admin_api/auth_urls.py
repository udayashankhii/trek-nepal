# admin_api/auth_urls.py
from django.urls import path

from .auth_views import (
    AdminLoginView,
    AdminMeView,
    AdminLogoutView,
    AdminTokenRefreshView,
    AdminTokenVerifyView,
)

urlpatterns = [
    path("login/", AdminLoginView.as_view(), name="admin-auth-login"),
    path("me/", AdminMeView.as_view(), name="admin-auth-me"),
    path("logout/", AdminLogoutView.as_view(), name="admin-auth-logout"),
    path("refresh/", AdminTokenRefreshView.as_view(), name="admin-auth-refresh"),
    path("verify/", AdminTokenVerifyView.as_view(), name="admin-auth-verify"),
]

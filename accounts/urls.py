from django.urls import path

from .views import (
    ForgotPasswordView,
    GoogleLoginView,
    LoginView,
    LogoutView,
    RegisterView,
    ResendOtpView,
    ResetPasswordView,
    VerifyOtpView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="accounts-register"),
    path("register/resend-otp/", ResendOtpView.as_view(), name="accounts-resend-otp"),
    path("verify-otp/", VerifyOtpView.as_view(), name="accounts-verify-otp"),
    path("login/", LoginView.as_view(), name="accounts-login"),
    path("logout/", LogoutView.as_view(), name="accounts-logout"),
    path("google-login/", GoogleLoginView.as_view(), name="accounts-google-login"),
    path("password/forgot/", ForgotPasswordView.as_view(), name="accounts-forgot-password"),
    path("password/reset/", ResetPasswordView.as_view(), name="accounts-reset-password"),
]

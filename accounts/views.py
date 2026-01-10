from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

try:
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from rest_framework_simplejwt.tokens import RefreshToken
except Exception:  # pragma: no cover
    JWTAuthentication = None  # type: ignore
    RefreshToken = None  # type: ignore

from .models import AccountProfile, EmailOTP
from .serializers import (
    ForgotPasswordSerializer,
    GoogleLoginSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResendOtpSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    VerifyOtpSerializer,
)
from .services import (
    generate_otp_code,
    mark_previous_otps_used,
    otp_expiry,
    send_auth_event_email,
    send_otp_email,
    verify_google_token,
)

User = get_user_model()


def _tokens_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def _user_payload(user: User) -> dict:
    return {
        "user": UserSerializer(user).data,
        "role": "user",
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_register"

    @transaction.atomic
    def post(self, request):
        if RefreshToken is None:
            return Response({"detail": "JWT not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        username = serializer.validated_data["username"]
        phone_number = serializer.validated_data.get("phone_number", "")
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()
        username_taken = User.objects.filter(username__iexact=username).exclude(email__iexact=email).exists()
        if username_taken:
            return Response({"detail": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
        if user and user.is_active:
            return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if user is None:
            user = User.objects.create_user(username=username, email=email, password=password)
        else:
            user.username = username
            user.email = email
            user.set_password(password)
            user.save()

        user.is_active = False
        user.save(update_fields=["is_active"])

        profile, _ = AccountProfile.objects.get_or_create(user=user)
        profile.phone_number = phone_number
        profile.is_email_verified = False
        profile.save()

        mark_previous_otps_used(user.id, EmailOTP.Purpose.REGISTER)
        code = generate_otp_code()
        EmailOTP.objects.create(
            user=user,
            email=email,
            purpose=EmailOTP.Purpose.REGISTER,
            code=code,
            expires_at=otp_expiry(),
        )

        send_otp_email(email, code, EmailOTP.Purpose.REGISTER)
        return Response({"detail": "OTP sent to email."}, status=status.HTTP_200_OK)


class VerifyOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_otp"

    @transaction.atomic
    def post(self, request):
        if RefreshToken is None:
            return Response({"detail": "JWT not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = VerifyOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        code = serializer.validated_data["otp"]

        otp = (
            EmailOTP.objects.filter(email=email, purpose=EmailOTP.Purpose.REGISTER, is_used=False)
            .order_by("-created_at")
            .first()
        )

        if not otp or otp.is_expired() or otp.attempts >= 5:
            return Response({"detail": "OTP expired or invalid."}, status=status.HTTP_400_BAD_REQUEST)
        if otp.code != code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user = otp.user
        user.is_active = True
        user.save(update_fields=["is_active"])

        AccountProfile.objects.filter(user=user).update(is_email_verified=True)

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        try:
            send_auth_event_email(email, "welcome", user.username)
        except Exception:
            pass

        payload = _tokens_for_user(user)
        payload.update(_user_payload(user))
        return Response(payload, status=status.HTTP_200_OK)


class ResendOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_otp"

    @transaction.atomic
    def post(self, request):
        serializer = ResendOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        user = User.objects.filter(email__iexact=email).first()

        if user and not user.is_active:
            mark_previous_otps_used(user.id, EmailOTP.Purpose.REGISTER)
            code = generate_otp_code()
            EmailOTP.objects.create(
                user=user,
                email=email,
                purpose=EmailOTP.Purpose.REGISTER,
                code=code,
                expires_at=otp_expiry(),
            )
            send_otp_email(email, code, EmailOTP.Purpose.REGISTER)

        return Response({"detail": "If the email exists, a new OTP has been sent."}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_login"

    def post(self, request):
        if RefreshToken is None:
            return Response({"detail": "JWT not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response({"detail": "Account not verified."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_auth_event_email(email, "login", user.username)
        except Exception:
            pass

        payload = _tokens_for_user(user)
        payload.update(_user_payload(user))
        return Response(payload, status=status.HTTP_200_OK)


class LogoutView(APIView):
    authentication_classes = [] if JWTAuthentication is None else [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if RefreshToken is None:
            return Response({"ok": True}, status=status.HTTP_200_OK)

        refresh = request.data.get("refresh")
        if not refresh:
            return Response({"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh)
            try:
                token.blacklist()
            except Exception:
                pass
            return Response({"ok": True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_login"

    @transaction.atomic
    def post(self, request):
        if RefreshToken is None:
            return Response({"detail": "JWT not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        result = verify_google_token(token)
        if not result.get("ok"):
            return Response({"detail": result.get("error", "Invalid token")}, status=status.HTTP_400_BAD_REQUEST)

        data = result["data"]
        email = data.get("email", "").lower()
        username = (data.get("name") or email.split("@")[0] or "user").strip()

        if not email:
            return Response({"detail": "Google account missing email."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        created = False
        if not user:
            base_username = username
            suffix = 1
            while User.objects.filter(username=base_username).exists():
                base_username = f"{username}-{suffix}"
                suffix += 1
            user = User.objects.create_user(username=base_username, email=email)
            created = True

        user.is_active = True
        user.save(update_fields=["is_active"])

        profile, _ = AccountProfile.objects.get_or_create(user=user)
        profile.is_email_verified = True
        profile.save(update_fields=["is_email_verified"])

        try:
            send_auth_event_email(email, "welcome" if created else "login", user.username)
        except Exception:
            pass

        payload = _tokens_for_user(user)
        payload.update(_user_payload(user))
        return Response(payload, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_password"

    @transaction.atomic
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        user = User.objects.filter(email__iexact=email).first()

        if user:
            mark_previous_otps_used(user.id, EmailOTP.Purpose.PASSWORD_RESET)
            code = generate_otp_code()
            EmailOTP.objects.create(
                user=user,
                email=email,
                purpose=EmailOTP.Purpose.PASSWORD_RESET,
                code=code,
                expires_at=otp_expiry(),
            )
            send_otp_email(email, code, EmailOTP.Purpose.PASSWORD_RESET)

        return Response({"detail": "If the email exists, a reset code has been sent."}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "accounts_password"

    @transaction.atomic
    def post(self, request):
        if RefreshToken is None:
            return Response({"detail": "JWT not installed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        code = serializer.validated_data["otp"]
        new_password = serializer.validated_data["new_password"]

        otp = (
            EmailOTP.objects.filter(email=email, purpose=EmailOTP.Purpose.PASSWORD_RESET, is_used=False)
            .order_by("-created_at")
            .first()
        )

        if not otp or otp.is_expired() or otp.attempts >= 5:
            return Response({"detail": "OTP expired or invalid."}, status=status.HTTP_400_BAD_REQUEST)
        if otp.code != code:
            otp.attempts += 1
            otp.save(update_fields=["attempts"])
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user = otp.user
        user.set_password(new_password)
        user.save(update_fields=["password"])

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        try:
            send_auth_event_email(email, "password_changed", user.username)
        except Exception:
            pass

        payload = _tokens_for_user(user)
        payload.update(_user_payload(user))
        return Response(payload, status=status.HTTP_200_OK)

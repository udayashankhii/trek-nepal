from __future__ import annotations

import json
import random
from datetime import timedelta
from typing import Any, Dict
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from .models import EmailOTP


def generate_otp_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def otp_expiry(minutes: int = 10):
    return timezone.now() + timedelta(minutes=minutes)


def mark_previous_otps_used(user_id: int, purpose: str) -> None:
    EmailOTP.objects.filter(user_id=user_id, purpose=purpose, is_used=False).update(is_used=True)


def _send_templated_email(subject: str, to_email: str, template_name: str, context: Dict[str, Any]) -> None:
    context = {**context, "subject": subject}
    html_body = render_to_string(f"accounts/email/{template_name}.html", context)
    text_body = render_to_string(f"accounts/email/{template_name}.txt", context)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
        reply_to=[getattr(settings, "DEFAULT_REPLY_TO_EMAIL", settings.DEFAULT_FROM_EMAIL)],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)


def send_otp_email(email: str, code: str, purpose: str) -> None:
    subject = "EverTrek Nepal Verification Code"
    if purpose == EmailOTP.Purpose.PASSWORD_RESET:
        subject = "EverTrek Nepal Password Reset Code"

    heading = "Confirm your email"
    if purpose == EmailOTP.Purpose.PASSWORD_RESET:
        heading = "Reset your password"

    context = {
        "site_name": getattr(settings, "SITE_NAME", "EverTrek Nepal"),
        "support_email": getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL),
        "frontend_url": getattr(settings, "FRONTEND_URL", "http://localhost:5173"),
        "brand_color": getattr(settings, "BRAND_COLOR", "#2563eb"),
        "logo_url": getattr(settings, "LOGO_URL", ""),
        "company_address": getattr(settings, "COMPANY_ADDRESS", ""),
        "social_instagram": getattr(settings, "SOCIAL_INSTAGRAM", ""),
        "social_facebook": getattr(settings, "SOCIAL_FACEBOOK", ""),
        "social_youtube": getattr(settings, "SOCIAL_YOUTUBE", ""),
        "social_whatsapp": getattr(settings, "SOCIAL_WHATSAPP", ""),
        "heading": heading,
        "code": code,
        "expires_minutes": 10,
    }
    _send_templated_email(subject, email, "otp", context)


def send_auth_event_email(email: str, event: str, username: str | None = None) -> None:
    context = {
        "site_name": getattr(settings, "SITE_NAME", "EverTrek Nepal"),
        "support_email": getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL),
        "frontend_url": getattr(settings, "FRONTEND_URL", "http://localhost:5173"),
        "brand_color": getattr(settings, "BRAND_COLOR", "#2563eb"),
        "logo_url": getattr(settings, "LOGO_URL", ""),
        "company_address": getattr(settings, "COMPANY_ADDRESS", ""),
        "social_instagram": getattr(settings, "SOCIAL_INSTAGRAM", ""),
        "social_facebook": getattr(settings, "SOCIAL_FACEBOOK", ""),
        "social_youtube": getattr(settings, "SOCIAL_YOUTUBE", ""),
        "social_whatsapp": getattr(settings, "SOCIAL_WHATSAPP", ""),
        "username": username or "there",
        "event_time": timezone.localtime().strftime("%Y-%m-%d %H:%M"),
    }

    if event == "welcome":
        subject = "Welcome to EverTrek Nepal"
        _send_templated_email(subject, email, "welcome", context)
        return
    elif event == "login":
        subject = "EverTrek Nepal Login Alert"
        _send_templated_email(subject, email, "login_alert", context)
        return
    elif event == "password_changed":
        subject = "EverTrek Nepal Password Changed"
        _send_templated_email(subject, email, "password_changed", context)
        return
    else:
        return


def verify_google_token(token: str) -> Dict[str, Any]:
    if not token:
        return {"ok": False, "error": "Missing Google token"}

    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    req = Request(url, method="GET")

    try:
        with urlopen(req, timeout=6) as response:  # nosec B310
            data = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError) as exc:
        return {"ok": False, "error": "Google token verification failed", "detail": str(exc)}

    audience = data.get("aud")
    if settings.GOOGLE_CLIENT_ID and audience != settings.GOOGLE_CLIENT_ID:
        return {"ok": False, "error": "Invalid Google audience"}

    issuer = data.get("iss")
    if issuer not in ("accounts.google.com", "https://accounts.google.com"):
        return {"ok": False, "error": "Invalid Google issuer"}

    exp = data.get("exp")
    try:
        if exp and int(exp) < int(timezone.now().timestamp()):
            return {"ok": False, "error": "Google token expired"}
    except Exception:
        return {"ok": False, "error": "Invalid Google token expiration"}

    if data.get("email_verified") not in ("true", True):
        return {"ok": False, "error": "Google email not verified"}

    return {"ok": True, "data": data}

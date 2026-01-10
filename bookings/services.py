from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from io import BytesIO
from typing import Optional, Tuple

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

from TrekCard.models import BookingIntent, TrekInfo
from .models import Booking, BookingReceipt

try:  # optional dependency
    from reportlab.lib.pagesizes import LETTER
    from reportlab.pdfgen import canvas
except Exception:  # pragma: no cover
    canvas = None  # type: ignore
    LETTER = None  # type: ignore


def _email_context(booking: Booking) -> dict:
    return {
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
        "booking": booking,
        "event_time": timezone.localtime().strftime("%Y-%m-%d %H:%M"),
    }


def _normalize_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_booking_pricing(
    trek: TrekInfo,
    party_size: int,
    intent: Optional[BookingIntent] = None,
) -> Optional[Tuple[Decimal, Decimal]]:
    if party_size < 1:
        raise ValueError("party_size must be >= 1")

    unit_price = None
    booking_card = getattr(trek, "booking_card", None)
    if booking_card:
        group_prices = booking_card.group_prices.all().order_by("min_size")
        for group in group_prices:
            min_ok = group.min_size is None or party_size >= group.min_size
            max_ok = group.max_size is None or party_size <= group.max_size
            if min_ok and max_ok:
                unit_price = Decimal(group.price)
                break
        if unit_price is None:
            unit_price = Decimal(booking_card.base_price)

    if unit_price is None and intent:
        base_price = intent.price_snapshot.get("base_price")
        if base_price:
            unit_price = Decimal(str(base_price))

    if unit_price is None:
        return None

    unit_price = _normalize_money(unit_price)
    total = _normalize_money(unit_price * Decimal(party_size))
    return unit_price, total


def generate_receipt_pdf(booking: Booking) -> Optional[BookingReceipt]:
    if canvas is None:
        return None

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, height - 60, f"{getattr(settings, 'SITE_NAME', 'EverTrek Nepal')} Receipt")

    pdf.setFont("Helvetica", 11)
    y = height - 110
    line_height = 16

    details = [
        ("Booking Ref", booking.booking_ref),
        ("Trek", booking.trek.title),
        ("Lead", booking.lead_name),
        ("Email", booking.lead_email),
        ("Phone", booking.lead_phone or "-"),
        ("Party Size", str(booking.party_size)),
        ("Start Date", booking.start_date.isoformat()),
        ("End Date", booking.end_date.isoformat()),
        ("Total", f"{booking.currency} {booking.total_amount}"),
        ("Status", booking.status),
    ]

    for label, value in details:
        pdf.drawString(50, y, f"{label}: {value}")
        y -= line_height

    pdf.setFont("Helvetica", 9)
    pdf.drawString(50, 60, f"Support: {getattr(settings, 'SUPPORT_EMAIL', '')}")
    pdf.showPage()
    pdf.save()

    buffer.seek(0)
    content = ContentFile(buffer.read())
    receipt, _ = BookingReceipt.objects.update_or_create(booking=booking)
    receipt.pdf.save(f"{booking.booking_ref}.pdf", content, save=True)
    return receipt


def send_booking_confirmation_email(booking: Booking) -> None:
    context = _email_context(booking)
    subject = f"Booking Confirmed • {booking.booking_ref}"
    html_body = render_to_string("bookings/email/booking_confirmation.html", context)
    text_body = render_to_string("bookings/email/booking_confirmation.txt", context)

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[booking.lead_email],
        reply_to=[getattr(settings, "DEFAULT_REPLY_TO_EMAIL", settings.DEFAULT_FROM_EMAIL)],
    )
    message.attach_alternative(html_body, "text/html")

    receipt = getattr(booking, "receipt", None)
    if receipt and receipt.pdf:
        message.attach_file(receipt.pdf.path)

    message.send(fail_silently=False)

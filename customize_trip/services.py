import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import strip_tags

from .models import CustomizeTripRequest

logger = logging.getLogger(__name__)


def send_customize_trip_notification(instance: CustomizeTripRequest) -> None:
    recipient_list = getattr(settings, "CUSTOMIZE_TRIP_ADMIN_EMAILS", [])
    if not recipient_list:
        default_recipient = getattr(settings, "DEFAULT_FROM_EMAIL", "hello@evertrek.com")
        recipient_list = [default_recipient]

    subject = f"Customize Trip request {instance.request_ref}"
    html_message = _build_html_message(instance)
    message = strip_tags(html_message)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "hello@evertrek.com")

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,
        )
    except Exception as exc:
        logger.warning("Unable to dispatch customize trip notification: %s", exc)


def _build_html_message(instance: CustomizeTripRequest) -> str:
    add_ons = ", ".join(instance.add_ons) if instance.add_ons else "None"
    product_name = instance.product_name or instance.trip_name or "Custom trip"
    product_slug = instance.product_slug or instance.trip_slug or "custom selection"
    product_type = instance.get_product_type_display() or "General"
    parts = [
        "<div>",
        f"<p><strong>Product</strong>: {product_name} ({product_slug}) • {product_type}</p>",
        f"<p><strong>Date</strong>: {instance.preferred_start_date or 'Flexible / TBD'} "
        f"({instance.get_date_flexibility_display()})</p>",
        f"<p><strong>Group</strong>: {instance.adults} adult{'s' if instance.adults != 1 else ''}"
        f"{f', {instance.children} children' if instance.children else ''}</p>",
        f"<p><strong>Accommodation</strong>: {instance.get_accommodation_display()}</p>",
        f"<p><strong>Transport</strong>: {instance.transport or 'Any'}</p>",
        f"<p><strong>Guide</strong>: {'Yes' if instance.guide_required else 'No'}</p>",
        f"<p><strong>Porter</strong>: {instance.get_porter_preference_display()}</p>",
        f"<p><strong>Add-ons</strong>: {add_ons}</p>",
        "<hr/>",
        f"<p><strong>Source</strong>: {instance.source or 'Not provided'}</p>",
        f"<p><strong>Origin URL</strong>: {instance.origin_url or 'Not provided'}</p>",
        "<hr/>",
        f"<p><strong>Contact</strong>: {instance.contact_name} / {instance.contact_email} / {instance.contact_phone}</p>",
        f"<p><strong>Country</strong>: {instance.contact_country}</p>",
        f"<p><strong>Fitness</strong>: {instance.get_fitness_level_display() or 'Not specified'}</p>",
        f"<p><strong>Budget</strong>: {instance.budget or 'Not specified'}</p>",
        f"<p><strong>Consent</strong>: {'Yes' if instance.consent_to_contact else 'No'}</p>",
        f"<p><strong>Special requests</strong>: {instance.special_requests or 'None'}</p>",
        "<p><em>This email was generated automatically by Evertrek Nepal.</em></p>",
        "</div>",
    ]
    return "".join(parts)

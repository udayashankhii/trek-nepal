from django.urls import path

from .views import (
    BookingBillingDetailsAPIView,
    BookingCreateAPIView,
    BookingDetailAPIView,
    BookingQuoteAPIView,
    CreatePaymentIntentAPIView,
    DevMarkPaidAPIView,
    StripeWebhookAPIView,
)


urlpatterns = [
    path("", BookingCreateAPIView.as_view(), name="booking-create"),
    path("quote/", BookingQuoteAPIView.as_view(), name="booking-quote"),
    path("<str:booking_ref>/", BookingDetailAPIView.as_view(), name="booking-detail"),
    path("<str:booking_ref>/billing-details/", BookingBillingDetailsAPIView.as_view(), name="booking-billing-details"),
    path("<str:booking_ref>/payment-intent/", CreatePaymentIntentAPIView.as_view(), name="booking-payment-intent"),
    path("<str:booking_ref>/mark-paid/", DevMarkPaidAPIView.as_view(), name="booking-mark-paid"),
    path("webhooks/stripe/", StripeWebhookAPIView.as_view(), name="stripe-webhook"),
]

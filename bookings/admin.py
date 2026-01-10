from django.contrib import admin

from .models import Booking, BookingBillingDetails, BookingFormDetails, BookingPayment, BookingReceipt


class BookingFormDetailsInline(admin.StackedInline):
    model = BookingFormDetails
    extra = 0
    can_delete = False


class BookingBillingDetailsInline(admin.StackedInline):
    model = BookingBillingDetails
    extra = 0
    can_delete = False


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("booking_ref", "trek", "lead_email", "status", "total_amount", "created_at")
    list_filter = ("status", "currency", "trek")
    search_fields = ("booking_ref", "lead_email", "lead_name", "trek__title")
    readonly_fields = ("booking_ref", "public_id", "created_at", "updated_at")
    inlines = [BookingFormDetailsInline, BookingBillingDetailsInline]


@admin.register(BookingPayment)
class BookingPaymentAdmin(admin.ModelAdmin):
    list_display = ("stripe_intent_id", "booking", "status", "amount", "currency", "created_at")
    list_filter = ("status", "currency")
    search_fields = ("stripe_intent_id", "booking__booking_ref", "booking__lead_email")
    readonly_fields = ("stripe_intent_id", "created_at", "updated_at")


@admin.register(BookingReceipt)
class BookingReceiptAdmin(admin.ModelAdmin):
    list_display = ("booking", "created_at")
    search_fields = ("booking__booking_ref", "booking__lead_email")
    readonly_fields = ("created_at",)

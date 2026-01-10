from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("TrekCard", "0003_trekitineraryday_latitude_trekitineraryday_longitude_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Booking",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ("booking_ref", models.CharField(db_index=True, max_length=32, unique=True)),
                ("party_size", models.PositiveIntegerField(default=1)),
                ("start_date", models.DateField()),
                ("end_date", models.DateField()),
                ("lead_name", models.CharField(max_length=128)),
                ("lead_email", models.EmailField(max_length=254)),
                ("lead_phone", models.CharField(blank=True, max_length=32)),
                ("total_amount", models.DecimalField(decimal_places=2, default="0.00", max_digits=10)),
                ("currency", models.CharField(default="USD", max_length=8)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("pending_payment", "Pending Payment"), ("paid", "Paid"), ("cancelled", "Cancelled"), ("failed", "Failed")], default="pending_payment", max_length=24)),
                ("notes", models.TextField(blank=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("booking_intent", models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="booking", to="TrekCard.bookingintent")),
                ("trek", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="bookings", to="TrekCard.trekinfo")),
                ("user", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="bookings", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="BookingPayment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("stripe_intent_id", models.CharField(max_length=255, unique=True)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("currency", models.CharField(default="USD", max_length=8)),
                ("status", models.CharField(choices=[("requires_payment_method", "Requires payment method"), ("requires_confirmation", "Requires confirmation"), ("requires_action", "Requires action"), ("processing", "Processing"), ("succeeded", "Succeeded"), ("canceled", "Canceled"), ("failed", "Failed")], default="requires_payment_method", max_length=32)),
                ("client_secret", models.CharField(blank=True, max_length=255)),
                ("raw_event", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("booking", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="payments", to="bookings.booking")),
            ],
        ),
    ]

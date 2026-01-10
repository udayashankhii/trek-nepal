from django.db import migrations, models
import django.db.models.deletion


def receipt_upload_path(instance, filename: str) -> str:
    return "bookings/receipts/"


class Migration(migrations.Migration):
    dependencies = [
        ("bookings", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="BookingReceipt",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("pdf", models.FileField(upload_to=receipt_upload_path)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("booking", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="receipt", to="bookings.booking")),
            ],
        ),
    ]

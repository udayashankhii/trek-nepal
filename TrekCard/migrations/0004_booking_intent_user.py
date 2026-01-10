from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("TrekCard", "0003_trekitineraryday_latitude_trekitineraryday_longitude_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="bookingintent",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.SET_NULL,
                related_name="booking_intents",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]

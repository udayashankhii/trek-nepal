from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customize_trip", "0002_alter_customizetriprequest_public_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="customizetriprequest",
            name="product_type",
            field=models.CharField(
                choices=[
                    ("trek", "Trek"),
                    ("tour", "Tour"),
                    ("general", "General"),
                ],
                default="general",
                max_length=32,
            ),
        ),
        migrations.AddField(
            model_name="customizetriprequest",
            name="product_slug",
            field=models.SlugField(blank=True, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name="customizetriprequest",
            name="product_name",
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]

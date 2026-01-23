from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="TravelStyle",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=140)),
                ("slug", models.SlugField(blank=True, max_length=140, unique=True)),
                ("description", models.TextField(blank=True)),
                ("hero_image_url", models.URLField(blank=True)),
                ("icon", models.CharField(blank=True, max_length=64)),
                (
                    "accent_color",
                    models.CharField(
                        blank=True,
                        help_text="Hex code or CSS color token to highlight this travel style",
                        max_length=9,
                    ),
                ),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("is_published", models.BooleanField(default=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["order", "name"],
                "verbose_name": "Travel Style",
                "verbose_name_plural": "Travel Styles",
            },
        )
    ]

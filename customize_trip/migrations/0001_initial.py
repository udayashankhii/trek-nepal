from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CustomizeTripRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(db_index=True, editable=False, unique=True)),
                ("request_ref", models.CharField(db_index=True, max_length=32, unique=True)),
                ("trip_slug", models.SlugField(blank=True, max_length=128)),
                ("trip_name", models.CharField(blank=True, max_length=256)),
                ("preferred_region", models.CharField(blank=True, max_length=64)),
                ("preferred_start_date", models.DateField(blank=True, null=True)),
                (
                    "date_flexibility",
                    models.CharField(
                        choices=[
                            ("exact", "Exact date"),
                            ("plus_3", "± 3 days"),
                            ("plus_7", "± 1 week"),
                            ("flexible", "Flexible / Open"),
                        ],
                        default="exact",
                        max_length=16,
                    ),
                ),
                ("duration_days", models.PositiveSmallIntegerField(default=10)),
                ("adults", models.PositiveSmallIntegerField(default=1)),
                ("children", models.PositiveSmallIntegerField(default=0)),
                ("private_trip", models.BooleanField(default=True)),
                (
                    "accommodation",
                    models.CharField(
                        choices=[
                            ("standard", "Standard teahouse"),
                            ("comfort", "Comfort"),
                            ("luxury", "Luxury"),
                        ],
                        default="comfort",
                        max_length=32,
                    ),
                ),
                ("transport", models.CharField(blank=True, max_length=64)),
                ("guide_required", models.BooleanField(default=True)),
                (
                    "porter_preference",
                    models.CharField(
                        choices=[
                            ("none", "None"),
                            ("shared", "Shared porter"),
                            ("per_person", "Porter per person"),
                        ],
                        default="shared",
                        max_length=16,
                    ),
                ),
                ("add_ons", models.JSONField(blank=True, default=list)),
                ("special_requests", models.TextField(blank=True)),
                ("origin_url", models.URLField(blank=True, max_length=512)),
                ("source", models.CharField(blank=True, max_length=128)),
                ("contact_name", models.CharField(max_length=128)),
                ("contact_email", models.EmailField(max_length=254)),
                ("contact_phone", models.CharField(max_length=32)),
                ("contact_country", models.CharField(max_length=128)),
                (
                    "fitness_level",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("beginner", "Beginner"),
                            ("average", "Average"),
                            ("fit", "Fit"),
                            ("very_fit", "Very fit"),
                        ],
                        max_length=16,
                    ),
                ),
                ("budget", models.CharField(blank=True, max_length=32)),
                ("consent_to_contact", models.BooleanField(default=False)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "New"),
                            ("in_review", "In review"),
                            ("quote_sent", "Quote sent"),
                            ("confirmed", "Confirmed"),
                            ("closed", "Closed"),
                        ],
                        default="new",
                        max_length=24,
                    ),
                ),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
                "verbose_name": "Customize Trip Request",
                "verbose_name_plural": "Customize Trip Requests",
            },
        ),
    ]

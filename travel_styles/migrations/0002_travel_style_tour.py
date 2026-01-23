from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("travel_styles", "0001_initial"),
        ("tours", "0002_tour_primary_style_tour_travel_styles"),
    ]

    operations = [
        migrations.CreateModel(
            name="TravelStyleTour",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "order",
                    models.PositiveIntegerField(
                        db_index=True,
                        default=0,
                    ),
                ),
                (
                    "is_featured",
                    models.BooleanField(
                        db_index=True,
                        default=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True),
                ),
                (
                    "travel_style",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="travel_style_tours",
                        to="travel_styles.travelstyle",
                    ),
                ),
                (
                    "tour",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="travel_style_links",
                        to="tours.tour",
                    ),
                ),
            ],
            options={
                "ordering": ["order", "-created_at"],
                "constraints": [
                    models.UniqueConstraint(
                        fields=["travel_style", "tour"],
                        name="travelstyle_tour_unique",
                    ),
                ],
                "indexes": [
                    models.Index(fields=["travel_style", "order"], name="travelstyle_order_idx"),
                    models.Index(
                        fields=["travel_style", "is_featured", "order"],
                        name="travelstyle_featured_order_idx",
                    ),
                ],
            },
        ),
    ]

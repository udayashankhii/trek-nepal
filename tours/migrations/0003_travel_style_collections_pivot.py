from django.db import migrations, models


def migrate_travel_styles(apps, schema_editor):
    Tour = apps.get_model("tours", "Tour")
    TravelStyleTour = apps.get_model("travel_styles", "TravelStyleTour")

    for tour in Tour.objects.prefetch_related("travel_styles").all():
        for idx, style in enumerate(tour.travel_styles.all(), start=1):
            TravelStyleTour.objects.get_or_create(
                travel_style=style,
                tour=tour,
                defaults={"order": idx},
            )


class Migration(migrations.Migration):

    dependencies = [
        ("tours", "0002_tour_primary_style_tour_travel_styles"),
        ("travel_styles", "0002_travel_style_tour"),
    ]

    operations = [
        migrations.RunPython(migrate_travel_styles, reverse_code=migrations.RunPython.noop),
        migrations.RemoveField(model_name="tour", name="travel_styles"),
        migrations.AddField(
            model_name="tour",
            name="travel_styles",
            field=models.ManyToManyField(
                blank=True,
                through="travel_styles.TravelStyleTour",
                to="travel_styles.travelstyle",
                related_name="tours",
            ),
        ),
    ]

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AboutPage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(max_length=120, unique=True)),
                ("title", models.CharField(max_length=255)),
                ("subtitle", models.CharField(blank=True, max_length=255)),
                ("summary", models.TextField(blank=True)),
                ("hero_image_url", models.URLField(blank=True)),
                ("hero_badge", models.CharField(blank=True, max_length=120)),
                ("blocks", models.JSONField(blank=True, default=list)),
                ("meta_title", models.CharField(blank=True, max_length=255)),
                ("meta_description", models.TextField(blank=True)),
                ("meta_keywords", models.JSONField(blank=True, default=list)),
                ("og_image_url", models.URLField(blank=True)),
                ("twitter_image_url", models.URLField(blank=True)),
                ("is_published", models.BooleanField(default=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["order", "title"]},
        ),
    ]

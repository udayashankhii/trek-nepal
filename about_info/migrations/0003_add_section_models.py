from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("about_info", "0002_seed_pages")]

    operations = [
        migrations.CreateModel(
            name="AboutStat",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("value", models.CharField(max_length=64)),
                ("label", models.CharField(max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="stats", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutFeature",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("text", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="features", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutTeamMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("role", models.CharField(blank=True, max_length=120)),
                ("image", models.CharField(blank=True, max_length=255)),
                ("bio", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="team_members", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutDocument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("image", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="documents", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutStep",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("step", models.CharField(max_length=16)),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="steps", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutPolicySection",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("bullets", models.JSONField(blank=True, default=list)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="policy_sections", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutTestimonial",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quote", models.TextField()),
                ("author", models.CharField(blank=True, max_length=120)),
                ("detail", models.CharField(blank=True, max_length=255)),
                ("image", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="testimonials", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutMilestone",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("year", models.CharField(max_length=12)),
                ("description", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="milestones", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
        migrations.CreateModel(
            name="AboutCTA",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("heading", models.CharField(max_length=255)),
                ("body", models.TextField(blank=True)),
                ("primary_label", models.CharField(blank=True, max_length=120)),
                ("primary_url", models.CharField(blank=True, max_length=255)),
                ("secondary_label", models.CharField(blank=True, max_length=120)),
                ("secondary_url", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("page", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="ctas", to="about_info.aboutpage")),
            ],
            options={"ordering": ["order"]},
        ),
    ]

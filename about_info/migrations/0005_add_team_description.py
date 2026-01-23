from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("about_info", "0004_seed_sections"),
    ]

    operations = [
        migrations.AddField(
            model_name="aboutpage",
            name="team_description",
            field=models.TextField(blank=True),
        ),
    ]

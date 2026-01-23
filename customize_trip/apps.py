from django.apps import AppConfig


class CustomizeTripConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "customize_trip"
    verbose_name = "Customize Trip"

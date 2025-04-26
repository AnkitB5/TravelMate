from django.apps import AppConfig


class TripsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'trips'

    def ready(self):
        """Import signals when the app is ready"""
        import trips.signals  # Import signals module to register the signals

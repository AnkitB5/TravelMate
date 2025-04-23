from django.core.management.base import BaseCommand
from trips.models import Trip
from trips.services.geocoding_service import GeocodingService
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Update coordinates for trips that are missing them'

    def add_arguments(self, parser):
        parser.add_argument('--trip-id', type=int, help='Update coordinates for a specific trip')

    def handle(self, *args, **options):
        trip_id = options.get('trip_id')
        
        if trip_id:
            trips = Trip.objects.filter(id=trip_id)
        else:
            trips = Trip.objects.filter(latitude__isnull=True, longitude__isnull=True)
        
        for trip in trips:
            if not trip.destination:
                logger.warning(f"Trip {trip.id} has no destination set")
                continue
                
            logger.info(f"Updating coordinates for trip {trip.id} with destination {trip.destination}")
            latitude, longitude = GeocodingService.get_coordinates(trip.destination)
            
            if latitude is not None and longitude is not None:
                trip.latitude = latitude
                trip.longitude = longitude
                trip.save()
                logger.info(f"Updated coordinates for trip {trip.id}: {latitude}, {longitude}")
            else:
                logger.error(f"Failed to get coordinates for trip {trip.id}") 
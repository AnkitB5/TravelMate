# trips/api_views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    Trip, Activity, PackingItem, CulturalInsight, 
    TravelTip, Profile, KeyFeature, UserStory
)
from .serializers import (
    TripSerializer, ActivitySerializer, PackingItemSerializer,
    CulturalInsightSerializer, TravelTipSerializer, ProfileSerializer,
    KeyFeatureSerializer, UserStorySerializer
)
from .services.weather_service import WeatherService
from .services.geocoding_service import GeocodingService

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if coordinates are provided
        latitude = serializer.validated_data.get('latitude')
        longitude = serializer.validated_data.get('longitude')
        
        if latitude is None or longitude is None:
            # Try to geocode the destination
            destination = serializer.validated_data.get('destination')
            latitude, longitude = GeocodingService.get_coordinates(destination)
            
        # Get weather data for the trip dates
        travel_start = serializer.validated_data.get('travel_start')
        travel_end = serializer.validated_data.get('travel_end')
        weather_data = WeatherService.get_weather_forecast(
            latitude=latitude,
            longitude=longitude,
            start_date=travel_start,
            end_date=travel_end
        )
        
        # Generate packing list based on activities and weather
        activities = serializer.validated_data.get('activities', [])
        traveler_type = serializer.validated_data.get('traveler_type', 'casual')
        packing_list = self.generate_packing_list(activities, weather_data, traveler_type)
        
        serializer.save(
            user=self.request.user,
            latitude=latitude,
            longitude=longitude,
            packing_list=packing_list
        )

    def generate_packing_list(self, activities, weather_data, traveler_type):
        packing_list = set()
        
        # Add essential items based on traveler type
        if traveler_type == 'business':
            packing_list.update([
                'Business attire (suits/dresses)',
                'Dress shoes',
                'Laptop and charger',
                'Business cards',
                'Portfolio/notebook'
            ])
        else:
            packing_list.update([
                'Casual clothing',
                'Comfortable shoes'
            ])
        
        # Add items based on activities
        for activity in activities:
            if activity == 'hiking':
                packing_list.update([
                    'Hiking boots',
                    'Backpack',
                    'Water bottle',
                    'Sunscreen',
                    'First aid kit'
                ])
            elif activity == 'beach':
                packing_list.update([
                    'Swimsuit',
                    'Beach towel',
                    'Sunscreen',
                    'Sunglasses',
                    'Flip flops'
                ])
            elif activity == 'sightseeing':
                packing_list.update([
                    'Comfortable walking shoes',
                    'Camera',
                    'Guidebook/map',
                    'Portable charger'
                ])
            elif activity == 'shopping':
                packing_list.update([
                    'Extra luggage space',
                    'Shopping bags',
                    'Comfortable shoes'
                ])
            elif activity == 'dining':
                if traveler_type == 'business':
                    packing_list.add('Business casual attire')
            elif activity == 'sports':
                packing_list.update([
                    'Sports equipment',
                    'Sports clothing',
                    'Sports shoes',
                    'Water bottle'
                ])
            elif activity == 'nightlife':
                packing_list.update([
                    'Evening wear',
                    'ID/passport',
                    'Comfortable shoes'
                ])
            elif activity == 'cultural':
                packing_list.update([
                    'Modest clothing',
                    'Comfortable shoes',
                    'Guidebook'
                ])
            elif activity == 'adventure':
                packing_list.update([
                    'Adventure gear',
                    'First aid kit',
                    'Waterproof clothing',
                    'Sturdy shoes'
                ])
        
        # Add weather-specific items
        if weather_data:
            avg_temp = sum(day['temperature_2m_max'] for day in weather_data['daily']) / len(weather_data['daily'])
            precipitation = any(day['precipitation_probability_max'] > 50 for day in weather_data['daily'])
            
            if avg_temp < 10:  # Cold weather
                packing_list.update([
                    'Winter coat',
                    'Warm gloves',
                    'Scarf',
                    'Thermal underwear',
                    'Warm socks'
                ])
            elif avg_temp < 20:  # Cool weather
                packing_list.update([
                    'Light jacket',
                    'Sweaters',
                    'Long pants'
                ])
            elif avg_temp > 30:  # Hot weather
                packing_list.update([
                    'Light clothing',
                    'Sunscreen',
                    'Hat',
                    'Sunglasses'
                ])
            
            if precipitation:
                packing_list.update([
                    'Rain jacket',
                    'Umbrella',
                    'Waterproof shoes'
                ])
        
        # Add universal items
        packing_list.update([
            'Passport/ID',
            'Travel documents',
            'Phone and charger',
            'Toiletries',
            'Medications',
            'Travel adapter',
            'First aid kit',
            'Water bottle'
        ])
        
        return list(packing_list)

class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Check if destination has changed
        if 'destination' in serializer.validated_data:
            destination = serializer.validated_data.get('destination')
            latitude, longitude = GeocodingService.get_coordinates(destination)
            serializer.save(latitude=latitude, longitude=longitude)
        else:
            serializer.save()

class ActivityListCreateView(generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

class PackingItemListCreateView(generics.ListCreateAPIView):
    queryset = PackingItem.objects.all()
    serializer_class = PackingItemSerializer
    permission_classes = [IsAuthenticated]

class CulturalInsightListView(generics.ListAPIView):
    serializer_class = CulturalInsightSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        destination = self.request.query_params.get('destination', '')
        traveler_type = self.request.query_params.get('traveler_type', '')
        queryset = CulturalInsight.objects.all()
        
        if destination:
            queryset = queryset.filter(destination=destination)
        if traveler_type:
            queryset = queryset.filter(traveler_type=traveler_type)
            
        return queryset

class TravelTipListView(generics.ListAPIView):
    serializer_class = TravelTipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        destination = self.request.query_params.get('destination', '')
        traveler_type = self.request.query_params.get('traveler_type', '')
        category = self.request.query_params.get('category', '')
        queryset = TravelTip.objects.all()
        
        if destination:
            queryset = queryset.filter(destination=destination)
        if traveler_type:
            queryset = queryset.filter(traveler_type=traveler_type)
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class ProfileRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_recommendations(request, trip_id):
    """Get recommendations for a specific trip"""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    # Get weather data
    weather_data = WeatherService.get_weather_forecast(
        latitude=trip.latitude,
        longitude=trip.longitude
    )
    
    # Get user's profile
    profile = request.user.profile
    is_business = profile.traveler_type == 'business'
    
    # Generate recommendations
    recommendations = {
        'clothing': WeatherService.get_clothing_recommendations(
            weather_data=weather_data,
            is_business=is_business
        ),
        'activities': [],  # Add activity recommendations based on weather
        'packing': []  # Add packing recommendations
    }
    
    # Update trip with recommendations
    trip.recommendations = recommendations
    trip.save()
    
    return Response(recommendations)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_cultural_insights(request, trip_id):
    """Get cultural insights for a specific trip"""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    insights = CulturalInsight.objects.filter(
        destination=trip.destination,
        traveler_type=request.user.profile.traveler_type
    )
    
    serializer = CulturalInsightSerializer(insights, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_travel_tips(request, trip_id):
    """Get travel tips for a specific trip"""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    tips = TravelTip.objects.filter(
        destination=trip.destination,
        traveler_type=request.user.profile.traveler_type
    )
    
    serializer = TravelTipSerializer(tips, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_packing_list(request, trip_id):
    """Get personalized packing list for a trip"""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    
    # Get weather data
    weather_data = WeatherService.get_weather_forecast(
        latitude=trip.latitude,
        longitude=trip.longitude
    )
    
    # Get essential items based on traveler type
    essential_items = PackingItem.objects.filter(
        is_essential=True
    )
    
    # Get weather-specific items
    weather_items = []  # Add logic to get weather-appropriate items
    
    # Get activity-specific items
    activity_items = []
    for activity in trip.activities:
        items = PackingItem.objects.filter(activity_requirements__name=activity)
        activity_items.extend(items)
    
    # Combine all items
    all_items = list(essential_items) + weather_items + activity_items
    
    # Remove duplicates
    unique_items = list(set(all_items))
    
    serializer = PackingItemSerializer(unique_items, many=True)
    return Response(serializer.data)

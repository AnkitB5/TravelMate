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
import json
import requests
import os
from datetime import datetime

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
            
        # Calculate number of days for the trip
        travel_start = serializer.validated_data.get('travel_start')
        travel_end = serializer.validated_data.get('travel_end')
        
        # Calculate number of days for the trip
        trip_days = (travel_end - travel_start).days + 1
        
        weather_data = WeatherService.get_weather_forecast(
            latitude=latitude,
            longitude=longitude,
            days=trip_days,
            temperature_unit="fahrenheit"
        )
        
        # Generate packing list based on activities and weather
        activities = serializer.validated_data.get('activities', [])
        traveler_type = serializer.validated_data.get('traveler_type', 'casual')
        packing_list = self.generate_packing_list(activities, weather_data, traveler_type)
        
        # Convert packing list to JSON string
        packing_list_json = json.dumps(packing_list)
        
        serializer.save(
            user=self.request.user,
            latitude=latitude,
            longitude=longitude,
            packing_list=packing_list_json
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
        if weather_data and 'daily' in weather_data:
            try:
                # Calculate average temperature from the daily max temperatures
                max_temps = weather_data['daily']['temperature_2m_max']
                avg_temp = sum(max_temps) / len(max_temps) if max_temps else None
                
                # Check if there's high precipitation probability on any day
                precip_probs = weather_data['daily'].get('precipitation_probability_max', [])
                has_high_precipitation = any(prob > 50 for prob in precip_probs) if precip_probs else False
                
                if avg_temp is not None:
                    if avg_temp < 50:  # Cold weather (below 50°F)
                        packing_list.update([
                            'Winter coat',
                            'Warm gloves',
                            'Scarf',
                            'Thermal underwear',
                            'Warm socks'
                        ])
                    elif avg_temp < 65:  # Cool weather (50-65°F)
                        packing_list.update([
                            'Light jacket',
                            'Sweaters',
                            'Long pants'
                        ])
                    elif avg_temp > 80:  # Hot weather (above 80°F)
                        packing_list.update([
                            'Light clothing',
                            'Sunscreen',
                            'Hat',
                            'Sunglasses'
                        ])
                
                if has_high_precipitation:
                    packing_list.update([
                        'Rain jacket',
                        'Umbrella',
                        'Waterproof shoes'
                    ])
            except (KeyError, TypeError) as e:
                print(f"Error processing weather data: {e}")
                # Continue without weather-specific items if there's an error
                pass
        
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

    # 1) Load any existing insights
    qs   = CulturalInsight.objects.filter(
        destination=trip.destination,
        traveler_type=request.user.profile.traveler_type
    )
    data = CulturalInsightSerializer(qs, many=True).data

    # 2) If there's no dress_code, append one from our map
    if not any(item.get('category') == 'dress_code' for item in data):
        # Extract country = last comma‑separated segment
        parts   = [p.strip() for p in trip.destination.split(',')]
        country = parts[-1].title() if parts else trip.destination.title()

        # Hard‑coded dress codes for popular destinations
        dress_map = {
            "India": {
                "title":       "India – Traditional Attire",
                "description": (
                    "Women often wear saris or salwar kameez; "
                    "men commonly wear kurta‑pajama or formal suits."
                )
            },
            "France": {
                "title":       "France – Chic European Style",
                "description": (
                    "Smart‑casual clothing: tailored trousers or skirts, "
                    "light jackets, and scarves are typical."
                )
            },
            "Japan": {
                "title":       "Japan – Respectful Dress",
                "description": (
                    "For ceremonies, traditional kimono; daily wear is "
                    "neat, conservative western attire."
                )
            },
            "China": {
                "title":       "China – Modern Meets Traditional",
                "description": (
                    "You may see qipaos (cheongsams) at formal events; "
                    "for everyday wear, modern casual is common."
                )
            },
            "Mexico": {
                "title":       "Mexico – Vibrant Traditional Wear",
                "description": (
                    "Embrace bright huipils or embroidered dresses; "
                    "men sometimes wear guayabera shirts."
                )
            },
            "Brazil": {
                "title":       "Brazil – Tropical Comfort",
                "description": (
                    "Light fabrics and swimwear for the coast; "
                    "modest cover‑ups for religious sites."
                )
            },
            "United Kingdom": {
                "title":       "UK – Smart Reserved Style",
                "description": (
                    "Neutral colors, trench coats or blazers; "
                    "formal hats at events like horse races."
                )
            },
            "Germany": {
                "title":       "Germany – Functional Fashion",
                "description": (
                    "Dirndls and lederhosen for festivals; "
                    "practical layers and comfortable shoes otherwise."
                )
            },
            "Italy": {
                "title":       "Italy – Elegant European Fashion",
                "description": (
                    "Well‑tailored suits, dresses, and leather accessories; "
                    "smart casual for cafes and galleries."
                )
            },
            "Spain": {
                "title":       "Spain – Colourful & Festive",
                "description": (
                    "Flowing dresses or flamenco‑style skirts for festivals; "
                    "casual chic in urban areas."
                )
            },
        }

        entry = dress_map.get(country, {
            "title":       f"{country} – Recommended Dress Code",
            "description": (
                "Pack modest, climate‑appropriate attire—smart‑casual for city visits "
                "and a light jacket for cooler evenings."
            )
        })

        data.append({
            "id":            None,
            "destination":   trip.destination,
            "category":      "dress_code",
            "title":         entry["title"],
            "description":   entry["description"],
            "traveler_type": request.user.profile.traveler_type,
        })

    return Response(data)

# ——— Country‑based customs & lifestyle tips ———
FALLBACK_TRAVEL_TIPS = {
    'India': [
        {
            'title': 'Use Namaste Greeting',
            'description': 'Press your palms together and say “Namaste” instead of shaking hands.'
        },
        {
            'title': 'Remove Shoes Indoors',
            'description': 'Always take off footwear before entering homes or temples.'
        },
        {
            'title': 'Avoid Public Displays of Affection',
            'description': 'PDA is generally frowned upon in most regions.'
        },
    ],
    'United States': [
        {
            'title': 'Tipping Culture',
            'description': 'It’s customary to tip service staff ~15–20% in restaurants and taxis.'
        },
        {
            'title': 'Informal Greetings',
            'description': 'A firm handshake and eye contact are common when meeting someone new.'
        },
        {
            'title': 'Personal Space',
            'description': 'Stand about an arm’s length apart when talking to people you don’t know well.'
        },
    ],
    'United Kingdom': [
        {
            'title': 'Queueing Etiquette',
            'description': 'Always wait your turn in line and don’t push ahead of others.'
        },
        {
            'title': 'Polite Manners',
            'description': 'Saying “please,” “thank you,” and “sorry” is very important in daily life.'
        },
        {
            'title': 'Talk of Weather',
            'description': 'Discussing the weather is a common ice-breaker.'
        },
    ],
    'Japan': [
        {
            'title': 'Bowing Etiquette',
            'description': 'A slight bow shows respect; deeper bows are for more formal occasions.'
        },
        {
            'title': 'Silence on Public Transport',
            'description': 'Keep your voice low or silent when riding trains and buses.'
        },
        {
            'title': 'No Tipping',
            'description': 'Tipping can confuse locals; excellent service is built in.'
        },
    ],
    'France': [
        {
            'title': 'La Bise Greeting',
            'description': 'Cheek‑kissing (2–4 times) is common among friends and family.'
        },
        {
            'title': 'Formal Address',
            'description': 'Use “Monsieur” or “Madame” until invited to use first names.'
        },
        {
            'title': 'Dining Pace',
            'description': 'Meals are leisurely—expect to dine for at least 1–2 hours.'
        },
    ],
    'Germany': [
        {
            'title': 'Punctuality',
            'description': 'Arrive on time for meetings and social gatherings.'
        },
        {
            'title': 'Formal Titles',
            'description': 'Address people by title (Dr., Herr, Frau) plus last name until invited otherwise.'
        },
        {
            'title': 'Quiet in Public',
            'description': 'Keep voices down in trains, libraries, and residential areas after 10 pm.'
        },
    ],
    'Italy': [
        {
            'title': 'Greetings',
            'description': 'A handshake, direct eye contact, and a smile are standard when meeting.'
        },
        {
            'title': 'Meal Times',
            'description': 'Lunch: 12:30–2:30; dinner: 7:30–10:00. Late dining is normal.'
        },
        {
            'title': 'Dress Modestly in Churches',
            'description': 'Cover shoulders and knees when entering religious sites.'
        },
    ],
    'Spain': [
        {
            'title': 'Siesta Hours',
            'description': 'Many shops close around 2–5 pm; plan errands accordingly.'
        },
        {
            'title': 'Affectionate Greetings',
            'description': 'Cheek kisses (two) are common among friends and family.'
        },
        {
            'title': 'Late Night Culture',
            'description': 'Dinner often starts after 9 pm, and nightlife goes on until dawn.'
        },
    ],
    'China': [
        {
            'title': 'Gift Giving Etiquette',
            'description': 'Offer and receive gifts with both hands; don’t open in front of the giver.'
        },
        {
            'title': 'Table Manners',
            'description': 'Wait for the host to begin eating; avoid sticking chopsticks upright in rice.'
        },
        {
            'title': 'Respect for Elders',
            'description': 'Elders dine first, and their opinions are highly respected.'
        },
    ],
    'Brazil': [
        {
            'title': 'Warm Greetings',
            'description': 'Two quick air kisses on the cheek (starting with the right) are typical.'
        },
        {
            'title': 'Social Punctuality',
            'description': 'Social events often start 15–30 minutes late; business events run on time.'
        },
        {
            'title': 'Casual Dress',
            'description': 'In most settings, casual, colorful attire is perfectly acceptable.'
        },
    ],
    'Australia': [
        {
            'title': 'Informal Culture',
            'description': 'First names are used quickly—even with managers or professors.'
        },
        {
            'title': 'Outdoor Lifestyle',
            'description': 'Packing sunscreen and hats is important—even if it looks cloudy.'
        },
        {
            'title': 'Barbecue Etiquette',
            'description': '“Barbie” (barbecue) is a social event—feel free to bring salads or drinks to share.'
        },
    ],
    'Mexico': [
        {
            'title': 'Respectful Greetings',
            'description': 'A handshake and eye contact; close friends may hug and kiss once on the cheek.'
        },
        {
            'title': 'Family Focus',
            'description': 'Family gatherings are large and festive—arriving a bit late is often fine.'
        },
        {
            'title': 'Dining Customs',
            'description': 'It’s polite to try a bit of everything served and compliment the cook.'
        },
    ],
}

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_travel_tips(request, trip_id):
    """Get travel tips for a specific trip"""
    trip = get_object_or_404(Trip, id=trip_id, user=request.user)
    country = trip.destination.split(',')[-1].strip()

    # 1) DB‑driven tips
    qs = TravelTip.objects.filter(
        destination__iexact=country,
        traveler_type=request.user.profile.traveler_type
    )
    serializer = TravelTipSerializer(qs, many=True)
    if serializer.data:
        return Response(serializer.data)

    # 2) Country fallback
    if country in FALLBACK_TRAVEL_TIPS:
        return Response(FALLBACK_TRAVEL_TIPS[country])

    # 3) Generic fallback
    return Response([
        {
            'title': 'Observe Local Customs',
            'description': 'Take time to research greetings, dining etiquette, and social norms before you travel.'
        }
    ])

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def trip_packing_list(request, trip_id):
    """
    GET: Retrieve the packing list for a trip
    POST: Generate a new packing list based on activities and save it
    """
    try:
        trip = Trip.objects.get(pk=trip_id, user=request.user)
    except Trip.DoesNotExist:
        return Response({'error': 'Trip not found'}, status=404)

    if request.method == 'GET':
        try:
            # Try to get the saved packing list
            if trip.packing_list:
                packing_list = json.loads(trip.packing_list)
                return Response(packing_list)
            
            # If no packing list exists, generate a new one
            activities = json.loads(trip.activities) if trip.activities else []
            packing_list = generate_packing_list(trip, activities)
            return Response(packing_list)
            
        except json.JSONDecodeError:
            return Response({'error': 'Invalid packing list data'}, status=400)

    elif request.method == 'POST':
        try:
            # Get activities from request or trip
            activities = request.data.get('activities', [])
            if not activities and trip.activities:
                activities = json.loads(trip.activities)

            packing_list = generate_packing_list(trip, activities)
            
            # Save the generated packing list
            trip.packing_list = json.dumps(packing_list)
            trip.save()
            
            return Response(packing_list)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)

def generate_packing_list(trip, activities):
    """Generate a packing list based on trip details and activities"""
    packing_list = []
    
    # Add essential items
    essentials = [
        {'id': 'essential-1', 'name': 'Passport/ID', 'category': 'Documents', 'description': 'Required for travel'},
        {'id': 'essential-2', 'name': 'Phone Charger', 'category': 'Electronics', 'description': 'Keep your devices charged'},
        {'id': 'essential-3', 'name': 'Toiletries', 'category': 'Personal Care', 'description': 'Basic hygiene items'},
    ]
    packing_list.extend(essentials)
    
    # Add weather-specific items
    try:
        weather_data = WeatherService.get_weather_forecast(trip.latitude, trip.longitude)
        if weather_data:
            avg_temp = calculate_average_temperature(weather_data)
            
            if avg_temp > 25:  # Hot weather
                hot_weather_items = [
                    {'id': 'weather-1', 'name': 'Sunscreen', 'category': 'Personal Care', 'description': 'SPF 30 or higher'},
                    {'id': 'weather-2', 'name': 'Sunglasses', 'category': 'Accessories', 'description': 'UV protection'},
                    {'id': 'weather-3', 'name': 'Hat', 'category': 'Clothing', 'description': 'Sun protection'},
                ]
                packing_list.extend(hot_weather_items)
            elif avg_temp < 10:  # Cold weather
                cold_weather_items = [
                    {'id': 'weather-4', 'name': 'Winter Coat', 'category': 'Clothing', 'description': 'For cold weather'},
                    {'id': 'weather-5', 'name': 'Gloves', 'category': 'Accessories', 'description': 'Keep hands warm'},
                    {'id': 'weather-6', 'name': 'Scarf', 'category': 'Accessories', 'description': 'For cold weather'},
                ]
                packing_list.extend(cold_weather_items)
    except Exception as e:
        print(f"Error getting weather data: {e}")
    
    # Add activity-specific items
    for activity in activities:
        activity_name = activity.get('name', activity) if isinstance(activity, dict) else str(activity)
        
        if 'hiking' in activity_name.lower():
            hiking_items = [
                {'id': f'hiking-{i}', 'name': item, 'category': 'Activities', 'description': desc}
                for i, (item, desc) in enumerate([
                    ('Hiking Boots', 'Sturdy footwear for trails'),
                    ('Water Bottle', 'Stay hydrated on hikes'),
                    ('First Aid Kit', 'For emergencies'),
                    ('Trail Map', 'Navigation essential')
                ], 1)
            ]
            packing_list.extend(hiking_items)
            
        elif 'beach' in activity_name.lower():
            beach_items = [
                {'id': f'beach-{i}', 'name': item, 'category': 'Activities', 'description': desc}
                for i, (item, desc) in enumerate([
                    ('Swimsuit', 'For swimming and beach activities'),
                    ('Beach Towel', 'For drying off'),
                    ('Beach Bag', 'Carry beach essentials'),
                    ('Flip Flops', 'Beach footwear')
                ], 1)
            ]
            packing_list.extend(beach_items)
            
        elif 'business' in activity_name.lower():
            business_items = [
                {'id': f'business-{i}', 'name': item, 'category': 'Business', 'description': desc}
                for i, (item, desc) in enumerate([
                    ('Business Attire', 'Professional clothing'),
                    ('Laptop', 'For work and presentations'),
                    ('Business Cards', 'For networking'),
                    ('Portfolio/Notebook', 'For meetings')
                ], 1)
            ]
            packing_list.extend(business_items)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_packing_list = []
    for item in packing_list:
        if item['name'] not in seen:
            seen.add(item['name'])
            unique_packing_list.append(item)
    
    return unique_packing_list

def calculate_average_temperature(weather_data):
    """Calculate average temperature from weather data"""
    try:
        if weather_data and 'daily' in weather_data:
            max_temps = weather_data['daily']['temperature_2m_max']
            min_temps = weather_data['daily']['temperature_2m_min']
            if max_temps and min_temps:
                avg_temps = [(max_temp + min_temp) / 2 for max_temp, min_temp in zip(max_temps, min_temps)]
                return sum(avg_temps) / len(avg_temps)
    except Exception as e:
        print(f"Error calculating average temperature: {e}")
    return 20  # Default temperature if calculation fails

# Predefined activity recommendations based on destination types
ACTIVITY_RECOMMENDATIONS = {
    'beach': {
        'casual': [
            'Beach volleyball',
            'Snorkeling',
            'Sunset watching',
            'Beach yoga',
            'Local seafood dining'
        ],
        'business': [
            'Beachfront meetings',
            'Golf',
            'Spa treatments',
            'Fine dining',
            'Networking events'
        ]
    },
    'mountain': {
        'casual': [
            'Hiking',
            'Mountain biking',
            'Photography',
            'Local cuisine tasting',
            'Nature walks'
        ],
        'business': [
            'Mountain resort meetings',
            'Team building activities',
            'Spa relaxation',
            'Fine dining',
            'Networking events'
        ]
    },
    'city': {
        'casual': [
            'City tours',
            'Museum visits',
            'Local markets',
            'Street food tasting',
            'Shopping'
        ],
        'business': [
            'Business networking',
            'Conference attendance',
            'Fine dining',
            'Cultural events',
            'Professional workshops'
        ]
    }
}

# Predefined packing suggestions
PACKING_SUGGESTIONS = {
    'beach': {
        'casual': [
            'Swimsuit',
            'Sunscreen',
            'Beach towel',
            'Sunglasses',
            'Flip flops'
        ],
        'business': [
            'Business casual attire',
            'Sunscreen',
            'Swimsuit',
            'Dress shoes',
            'Laptop'
        ]
    },
    'mountain': {
        'casual': [
            'Hiking boots',
            'Warm clothing',
            'Water bottle',
            'Backpack',
            'Camera'
        ],
        'business': [
            'Business attire',
            'Comfortable shoes',
            'Laptop',
            'Warm jacket',
            'Business cards'
        ]
    },
    'city': {
        'casual': [
            'Comfortable shoes',
            'City map',
            'Camera',
            'Day bag',
            'Travel guide'
        ],
        'business': [
            'Business attire',
            'Laptop',
            'Business cards',
            'Dress shoes',
            'Portfolio'
        ]
    }
}

# Predefined travel tips
TRAVEL_TIPS = {
    'beach': {
        'casual': [
            'Apply sunscreen regularly',
            'Stay hydrated',
            'Respect local beach rules',
            'Try local seafood',
            'Learn basic local phrases'
        ],
        'business': [
            'Schedule meetings early morning',
            'Dress appropriately for meetings',
            'Check time zones',
            'Plan networking events',
            'Keep business cards handy'
        ]
    },
    'mountain': {
        'casual': [
            'Check weather forecast',
            'Wear appropriate footwear',
            'Stay on marked trails',
            'Pack snacks',
            'Respect wildlife'
        ],
        'business': [
            'Dress in layers',
            'Plan meetings indoors',
            'Check internet connectivity',
            'Allow extra travel time',
            'Keep important documents safe'
        ]
    },
    'city': {
        'casual': [
            'Use public transport',
            'Keep valuables secure',
            'Try local cuisine',
            'Learn basic directions',
            'Visit local markets'
        ],
        'business': [
            'Plan meetings near your hotel',
            'Dress professionally',
            'Check local business hours',
            'Keep receipts for expenses',
            'Network with local professionals'
        ]
    }
}

def get_destination_type(destination):
    """Determine the type of destination based on keywords"""
    destination = destination.lower()
    if any(word in destination for word in ['beach', 'coast', 'shore', 'island']):
        return 'beach'
    elif any(word in destination for word in ['mountain', 'hill', 'peak', 'valley']):
        return 'mountain'
    else:
        return 'city'

# Activity-specific recommendations
ACTIVITY_BASED_RECOMMENDATIONS = {
    'hiking': {
        'activities': [
            'Research trail difficulty levels',
            'Check weather conditions',
            'Plan rest stops',
            'Download offline maps',
            'Learn about local wildlife'
        ],
        'packing': [
            'Hiking boots',
            'Water bottle',
            'First aid kit',
            'Trail snacks',
            'Weather-appropriate clothing'
        ],
        'tips': [
            'Start early to avoid heat',
            'Tell someone your hiking plan',
            'Stay on marked trails',
            'Pack out all trash',
            'Check trail conditions before going'
        ]
    },
    'beach': {
        'activities': [
            'Research tide times',
            'Find local beach rules',
            'Plan water activities',
            'Check for beach amenities',
            'Look for nearby attractions'
        ],
        'packing': [
            'Swimsuit',
            'Sunscreen',
            'Beach towel',
            'Water shoes',
            'Beach umbrella'
        ],
        'tips': [
            'Apply sunscreen regularly',
            'Stay hydrated',
            'Watch for rip currents',
            'Protect valuables',
            'Respect local wildlife'
        ]
    },
    'business': {
        'activities': [
            'Research business etiquette',
            'Plan meeting locations',
            'Check time zones',
            'Schedule networking events',
            'Find local business centers'
        ],
        'packing': [
            'Business attire',
            'Laptop and charger',
            'Business cards',
            'Portfolio',
            'Travel adapter'
        ],
        'tips': [
            'Dress professionally',
            'Arrive early for meetings',
            'Keep receipts for expenses',
            'Network with locals',
            'Check local business hours'
        ]
    },
    'sightseeing': {
        'activities': [
            'Research popular attractions',
            'Plan daily itineraries',
            'Check opening hours',
            'Look for guided tours',
            'Find local transportation'
        ],
        'packing': [
            'Comfortable shoes',
            'Camera',
            'City map',
            'Portable charger',
            'Day bag'
        ],
        'tips': [
            'Buy tickets in advance',
            'Visit early to avoid crowds',
            'Use public transport',
            'Learn basic local phrases',
            'Keep valuables secure'
        ]
    }
}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_trip_recommendations(request):
    """Get personalized AI-powered trip recommendations"""
    try:
        trip_data = request.data
        destination = trip_data.get('destination')
        traveler_type = trip_data.get('traveler_type', 'casual')
        activities = trip_data.get('activities', [])

        # Get activity-specific recommendations
        activity_recommendations = []
        for activity in activities:
            if activity in ACTIVITY_BASED_RECOMMENDATIONS:
                activity_recommendations.extend(
                    ACTIVITY_BASED_RECOMMENDATIONS[activity]['activities']
                )

        # Use Hugging Face's free inference API for additional personalized recommendations
        API_URL = "https://api-inference.huggingface.co/models/gpt2"
        headers = {"Authorization": "Bearer hf_public"}

        prompt = f"""Based on these planned activities: {', '.join(activities)},
        suggest 5 unique and personalized activities for a {traveler_type} traveler in {destination}.
        Consider the traveler type and make the suggestions specific to their interests.
        Format as a numbered list."""

        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
        ai_recommendations = response.json()[0]['generated_text'].split('\n')[:5]
        
        # Combine activity-specific and AI-generated recommendations
        all_recommendations = list(set(activity_recommendations + ai_recommendations))
        return Response(all_recommendations[:5])

    except Exception as e:
        # Fallback to predefined recommendations
        dest_type = get_destination_type(destination)
        recommendations = ACTIVITY_RECOMMENDATIONS.get(dest_type, {}).get(traveler_type, [])
        return Response(recommendations)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_packing_suggestions(request):
    """Get personalized AI-powered packing suggestions"""
    try:
        trip_data = request.data
        destination = trip_data.get('destination')
        traveler_type = trip_data.get('traveler_type', 'casual')
        activities = trip_data.get('activities', [])

        # Get activity-specific packing suggestions
        activity_packing = []
        for activity in activities:
            if activity in ACTIVITY_BASED_RECOMMENDATIONS:
                activity_packing.extend(
                    ACTIVITY_BASED_RECOMMENDATIONS[activity]['packing']
                )

        # Use Hugging Face's free inference API for additional personalized suggestions
        API_URL = "https://api-inference.huggingface.co/models/gpt2"
        headers = {"Authorization": "Bearer hf_public"}

        prompt = f"""Based on these planned activities: {', '.join(activities)},
        suggest 5 essential packing items for a {traveler_type} traveler going to {destination}.
        Consider the specific activities and make the suggestions relevant to their needs.
        Format as a numbered list."""

        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
        ai_suggestions = response.json()[0]['generated_text'].split('\n')[:5]
        
        # Combine activity-specific and AI-generated suggestions
        all_suggestions = list(set(activity_packing + ai_suggestions))
        return Response(all_suggestions[:5])

    except Exception as e:
        # Fallback to predefined suggestions
        dest_type = get_destination_type(destination)
        suggestions = PACKING_SUGGESTIONS.get(dest_type, {}).get(traveler_type, [])
        return Response(suggestions)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_travel_tips(request):
    """Get personalized AI-powered travel tips"""
    try:
        trip_data = request.data
        destination = trip_data.get('destination')
        traveler_type = trip_data.get('traveler_type', 'casual')
        activities = trip_data.get('activities', [])

        # Get activity-specific tips
        activity_tips = []
        for activity in activities:
            if activity in ACTIVITY_BASED_RECOMMENDATIONS:
                activity_tips.extend(
                    ACTIVITY_BASED_RECOMMENDATIONS[activity]['tips']
                )

        # Use Hugging Face's free inference API for additional personalized tips
        API_URL = "https://api-inference.huggingface.co/models/gpt2"
        headers = {"Authorization": "Bearer hf_public"}

        prompt = f"""Based on these planned activities: {', '.join(activities)},
        provide 5 helpful travel tips for a {traveler_type} traveler visiting {destination}.
        Consider the specific activities and make the tips relevant to their needs.
        Format as a numbered list."""

        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
        ai_tips = response.json()[0]['generated_text'].split('\n')[:5]
        
        # Combine activity-specific and AI-generated tips
        all_tips = list(set(activity_tips + ai_tips))
        return Response(all_tips[:5])

    except Exception as e:
        # Fallback to predefined tips
        dest_type = get_destination_type(destination)
        tips = TRAVEL_TIPS.get(dest_type, {}).get(traveler_type, [])
        return Response(tips)

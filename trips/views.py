# trips/views.py
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .models import Trip, KeyFeature, UserStory, Profile
from .serializers import TripSerializer, KeyFeatureSerializer, UserStorySerializer
import json
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .services.weather_service import WeatherService
from .services.geocoding_service import GeocodingService
from datetime import datetime
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.conf import settings
from django.core.mail import EmailMessage
import os
import requests
import traceback
from django.shortcuts import redirect
from django.http import HttpResponseNotAllowed

# API Views (for JSON endpoints)
class TripListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if coordinates are provided from frontend
        latitude = serializer.validated_data.get('latitude')
        longitude = serializer.validated_data.get('longitude')
        
        # If coordinates are already provided (from the city search), use them
        if latitude is not None and longitude is not None:
            serializer.save(user=self.request.user)
        else:
            # Otherwise, try to geocode the destination
            destination = serializer.validated_data.get('destination')
            latitude, longitude = GeocodingService.get_coordinates(destination)
            serializer.save(
                user=self.request.user,
                latitude=latitude,
                longitude=longitude
            )

class TripDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        # Check if latitude and longitude are provided directly
        latitude = serializer.validated_data.get('latitude')
        longitude = serializer.validated_data.get('longitude')
        
        # If coordinates are explicitly provided, use them
        if latitude is not None and longitude is not None:
            serializer.save()
        # Check if destination has changed
        elif 'destination' in serializer.validated_data:
            destination = serializer.validated_data.get('destination')
            # Try to geocode the new destination
            latitude, longitude = GeocodingService.get_coordinates(destination)
            serializer.save(latitude=latitude, longitude=longitude)
        else:
            serializer.save()

class KeyFeatureListAPIView(generics.ListAPIView):
    queryset = KeyFeature.objects.all()
    serializer_class = KeyFeatureSerializer

class UserStoryListAPIView(generics.ListAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer

# Webpage Views (to render HTML templates)
def home(request):
    # For now, we'll show a simple home page. You can later update this to render a template.
    return render(request, 'trips/home.html')
    # Or, if you prefer a simple HttpResponse:
    # return HttpResponse("Welcome to TravelMate Home Page")

def key_features(request):
    # Retrieve all key features and render them in the key_features template.
    features = KeyFeature.objects.all()
    return render(request, 'trips/key_features.html', {'features': features})

def user_stories(request):
    # Retrieve all user stories and render them in the user_stories template.
    stories = UserStory.objects.all()
    return render(request, 'trips/user_stories.html', {'stories': stories})

def trip_dashboard(request):
    from .models import Trip
    trips = Trip.objects.filler(user = request.user)
    return render(request, 'trips/trip_dashboard.html', {'trips': trips})


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
            
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        traveler_type = data.get('traveler_type')

        if not all([username, password, first_name, last_name, email]):
            return JsonResponse({'error': 'All fields are required.'}, status=400)
        
        if traveler_type not in ['casual', 'business']:
            return JsonResponse({'error': 'Traveler type must be "casual" or "business".'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)
            
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists.'}, status=400)

        # Create the user with additional fields
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        
        # Create a corresponding Profile for the new user
        Profile.objects.create(user=user, traveler_type=traveler_type)

        return JsonResponse({'message': 'User created successfully.'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_weather_forecast(request, trip_id):
    """Get weather forecast for a specific trip"""
    try:
        trip = Trip.objects.get(pk=trip_id, user=request.user)
        
        # Check if we have lat/long for the destination
        if not trip.latitude or not trip.longitude:
            return Response(
                {"error": "No location coordinates available for this destination."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate number of days to forecast (from travel start to end)
        travel_start = trip.travel_start
        travel_end = trip.travel_end
        trip_days = (travel_end - travel_start).days + 1
        
        # Ensure we get at least 7 days, but cover the entire trip if longer
        forecast_days = max(7, trip_days)
            
        # Get weather data from Open-Meteo (in Fahrenheit)
        weather_data = WeatherService.get_weather_forecast(
            latitude=trip.latitude,
            longitude=trip.longitude,
            days=forecast_days,
            temperature_unit="fahrenheit"
        )
        
        if not weather_data:
            return Response(
                {"error": "Unable to fetch weather data at this time."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        # Highlight which days are part of the trip
        if 'daily' in weather_data:
            # Add a flag for whether each date is during the trip
            is_trip_day = []
            for date_str in weather_data['daily']['time']:
                date = datetime.strptime(date_str, "%Y-%m-%d").date()
                is_during_trip = travel_start <= date <= travel_end
                is_trip_day.append(is_during_trip)
            
            # Add to the response
            weather_data['trip_days'] = is_trip_day
            weather_data['trip_start_date'] = travel_start.strftime("%Y-%m-%d")
            weather_data['trip_end_date'] = travel_end.strftime("%Y-%m-%d")
            
        # Return the weather data
        return Response(weather_data)
    
    except Trip.DoesNotExist:
        return Response(
            {"error": "Trip not found or unauthorized."}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_clothing_recommendations(request, trip_id):
    """Get clothing recommendations based on weather and traveler type"""
    try:
        trip = Trip.objects.get(pk=trip_id, user=request.user)
        
        # Check if we have lat/long for the destination
        if not trip.latitude or not trip.longitude:
            return Response(
                {"error": "No location coordinates available for this destination."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get user's traveler type
        try:
            profile = request.user.profile
            is_business = profile.traveler_type == 'business'
        except Profile.DoesNotExist:
            # Default to casual traveler if no profile
            is_business = False
            
        # Get weather data
        weather_data = WeatherService.get_weather_forecast(
            latitude=trip.latitude,
            longitude=trip.longitude
        )
        
        if not weather_data:
            return Response(
                {"error": "Unable to fetch weather data at this time."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        # Generate clothing recommendations
        recommendations = WeatherService.get_clothing_recommendations(
            weather_data=weather_data,
            is_business=is_business
        )
        
        # Update trip with recommendations
        trip.recommendations = recommendations
        trip.save()
        
        return Response({
            "traveler_type": "business" if is_business else "casual",
            "recommendations": recommendations
        })
        
    except Trip.DoesNotExist:
        return Response(
            {"error": "Trip not found or unauthorized."}, 
            status=status.HTTP_404_NOT_FOUND
        )

def trip_weather_view(request, trip_id):
    """
    View to render the weather forecast template for a trip
    """
    try:
        trip = Trip.objects.get(pk=trip_id, user=request.user)
        
        # Check if we have coordinates
        if not trip.latitude or not trip.longitude:
            return render(request, 'trips/trip_weather.html', {
                'trip': trip,
                'error': 'No location coordinates available for this destination.'
            })
        
        # Calculate number of days to forecast (from travel start to end)
        travel_start = trip.travel_start
        travel_end = trip.travel_end
        trip_days = (travel_end - travel_start).days + 1
        
        # Ensure we get at least 7 days, but cover the entire trip if longer
        forecast_days = max(7, trip_days)
            
        # Get weather data
        weather_data = WeatherService.get_weather_forecast(
            latitude=trip.latitude,
            longitude=trip.longitude,
            days=forecast_days,
            temperature_unit="fahrenheit"
        )
        
        if not weather_data:
            return render(request, 'trips/trip_weather.html', {
                'trip': trip,
                'error': 'Unable to fetch weather data at this time.'
            })
            
        # Get user's traveler type for recommendations
        try:
            profile = request.user.profile
            is_business = profile.traveler_type == 'business'
        except Profile.DoesNotExist:
            is_business = False
            
        # Generate clothing recommendations
        recommendations = WeatherService.get_clothing_recommendations(
            weather_data=weather_data,
            is_business=is_business
        )
        
        # Extract and format the data for the template
        current = {}
        if 'current_weather' in weather_data:
            current_data = weather_data['current_weather']
            current = {
                'temperature': current_data.get('temperature'),
                'windspeed': current_data.get('windspeed'),
                'conditions': 'Varied'  # Open-Meteo doesn't provide text conditions
            }
            
        # Format daily forecast
        forecast = []
        if 'daily' in weather_data:
            daily = weather_data['daily']
            for i, date in enumerate(daily['time']):
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
                is_during_trip = trip.travel_start <= date_obj <= trip.travel_end
                
                day_data = {
                    'date': date,
                    'temp_max': daily['temperature_2m_max'][i],
                    'temp_min': daily['temperature_2m_min'][i],
                    'precipitation': daily['precipitation_probability_max'][i],
                    'recommendations': recommendations.get(date, []),
                    'is_trip_day': is_during_trip
                }
                forecast.append(day_data)
                
        return render(request, 'trips/trip_weather.html', {
            'trip': trip,
            'current': current,
            'forecast': forecast,
            'temperature_unit': 'F'  # Indicate Fahrenheit
        })
        
    except Trip.DoesNotExist:
        return HttpResponse("Trip not found or unauthorized.", status=404)

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user to search cities
def search_cities(request):
    """
    Search for cities using the Open-Meteo geocoding API
    """
    query = request.GET.get('q', '')
    if not query or len(query) < 2:
        return Response(
            {"error": "Please provide a search query with at least 2 characters."},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    # Get the number of results to return (default: 10)
    limit = request.GET.get('limit', 10)
    try:
        limit = int(limit)
        if limit < 1 or limit > 50:
            limit = 10  # Reset to default if outside range
    except ValueError:
        limit = 10
    
    # Search for cities
    cities = GeocodingService.search_cities(query, limit)
    
    return Response({
        "query": query,
        "count": len(cities),
        "cities": cities
    })

@csrf_exempt
def password_reset_request(request):
    if request.method == 'GET':
        # render the HTML form
        return render(request, 'password_reset.html')

    if request.method == 'POST':
        # JSON body?
        if request.content_type.startswith('application/json'):
            try:
                data = json.loads(request.body)
                email = data.get('email')
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        else:
            # form submit
            email = request.POST.get('email')

        if not email:
            error = 'Email is required.'
            if request.content_type.startswith('application/json'):
                return JsonResponse({'error': error}, status=400)
            return render(request, 'password_reset.html', {'error': error})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # always succeed to avoid leaking
            if request.content_type.startswith('application/json'):
                return JsonResponse({'message': 'If an account exists with this email, you will receive instructions.'})
            return render(request, 'password_reset.html', {
                'message': 'If an account exists with this email, you will receive instructions.'
            })

        # generate token + uid
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = request.build_absolute_uri(
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )

        # render and send via Mailgun (or console)
        subject = 'Your TravelMate Password Reset'
        html_message = render_to_string('password_reset_email.html', {
            'user': user,
            'reset_url': reset_url,
        })

        try:
            MAILGUN_API_KEY = os.getenv('MAILGUN_API_KEY')
            MAILGUN_DOMAIN  = os.getenv('MAILGUN_DOMAIN')
            response = requests.post(
                f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
                auth=("api", MAILGUN_API_KEY),
                data={
                    "from":    f"TravelMate <postmaster@{MAILGUN_DOMAIN}>",
                    "to":      [email],
                    "subject": subject,
                    "html":    html_message,
                }
            )
        except Exception:
            traceback.print_exc()
            # swallow

        if request.content_type.startswith('application/json'):
            return JsonResponse({'message': 'If an account exists with this email, you will receive instructions.'})
        return render(request, 'password_reset.html', {
            'message': 'If an account exists with this email, you will receive instructions.'
        })

@csrf_exempt
def password_reset_confirm(request, uidb64, token):
    # Decode the UID
    try:
        uid  = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        user = None

    if request.method == 'GET':
        # render form
        return render(request, 'password_reset_confirm.html', {
            'uidb64': uidb64,
            'token': token,
            'error': None,
        })

    if request.method == 'POST':
        # get new password
        if request.content_type.startswith('application/json'):
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON.'}, status=400)
            new_password = data.get('password')
            confirm      = None
        else:
            new_password = request.POST.get('password')
            confirm      = request.POST.get('confirm_password')

        if not new_password:
            msg = 'Password is required.'
            if request.content_type.startswith('application/json'):
                return JsonResponse({'error': msg}, status=400)
            return render(request, 'password_reset_confirm.html', {
                'uidb64': uidb64, 'token': token, 'error': msg
            })

        if confirm is not None and new_password != confirm:
            msg = 'Passwords do not match.'
            return render(request, 'password_reset_confirm.html', {
                'uidb64': uidb64, 'token': token, 'error': msg
            })

        if user is None or not default_token_generator.check_token(user, token):
            msg = 'Invalid or expired link.'
            if request.content_type.startswith('application/json'):
                return JsonResponse({'error': msg}, status=400)
            return render(request, 'password_reset_confirm.html', {
                'uidb64': uidb64, 'token': token, 'error': msg
            })

        # all good—actually set the password
        user.set_password(new_password)
        user.save()

        if request.content_type.startswith('application/json'):
            return JsonResponse({'message': 'Password has been reset successfully.'})
        # redirect to login or show a success page
        return redirect('login')  # or wherever your login URL is

    return HttpResponseNotAllowed(['GET', 'POST'])
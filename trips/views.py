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
from rest_framework.permissions import IsAuthenticated

# API Views (for JSON endpoints)
class TripListCreateAPIView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TripDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]


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
    trips = Trip.objects.all()
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
        traveler_type = data.get('traveler_type')  # New field from the request

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=400)
        
        if traveler_type not in ['casual', 'business']:
            return JsonResponse({'error': 'Traveler type must be "casual" or "business".'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'User already exists.'}, status=400)

        # Create the user
        user = User.objects.create_user(username=username, password=password)
        # Create a corresponding Profile for the new user
        Profile.objects.create(user=user, traveler_type=traveler_type)

        return JsonResponse({'message': 'User created successfully.'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)

# trips/api_views.py
from rest_framework import generics
from .models import Trip, KeyFeature, UserStory
from .serializers import TripSerializer, KeyFeatureSerializer, UserStorySerializer
from rest_framework.permissions import AllowAny

class TripListCreateAPIView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

class TripDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class KeyFeatureListAPIView(generics.ListAPIView):
    queryset = KeyFeature.objects.all()
    serializer_class = KeyFeatureSerializer

class UserStoryListAPIView(generics.ListAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer

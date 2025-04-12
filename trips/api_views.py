# trips/api_views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Trip, KeyFeature, UserStory
from .serializers import TripSerializer, KeyFeatureSerializer, UserStorySerializer

class TripListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return trips belonging to the current user.
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user to the currently authenticated user.
        serializer.save(user=self.request.user)

class TripDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

class KeyFeatureListAPIView(generics.ListAPIView):
    queryset = KeyFeature.objects.all()
    serializer_class = KeyFeatureSerializer

class UserStoryListAPIView(generics.ListAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer

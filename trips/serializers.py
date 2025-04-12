# trips/serializers.py
from rest_framework import serializers
from .models import Trip, KeyFeature, UserStory

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['id', 'destination', 'travel_start', 'travel_end', 'activities', 'packing_list', 'meeting_schedule', 'created_at']
        read_only_fields = ['user', 'created_at']

class KeyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFeature
        fields = ['id', 'title', 'description']

class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = ['id', 'role', 'story']

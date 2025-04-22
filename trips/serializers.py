from rest_framework import serializers
from .models import Trip, KeyFeature, UserStory, Activity, PackingItem, CulturalInsight, TravelTip, Profile
import json

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', 'description', 'packing_requirements', 'weather_considerations']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['packing_requirements'] = json.loads(instance.packing_requirements)
        data['weather_considerations'] = json.loads(instance.weather_considerations)
        return data

    def to_internal_value(self, data):
        if 'packing_requirements' in data:
            data['packing_requirements'] = json.dumps(data['packing_requirements'])
        if 'weather_considerations' in data:
            data['weather_considerations'] = json.dumps(data['weather_considerations'])
        return super().to_internal_value(data)

class PackingItemSerializer(serializers.ModelSerializer):
    activity_requirements = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = PackingItem
        fields = ['id', 'name', 'category', 'description', 'is_essential', 'weather_conditions', 'activity_requirements']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['weather_conditions'] = json.loads(instance.weather_conditions)
        return data

    def to_internal_value(self, data):
        if 'weather_conditions' in data:
            data['weather_conditions'] = json.dumps(data['weather_conditions'])
        return super().to_internal_value(data)

class CulturalInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = CulturalInsight
        fields = ['id', 'destination', 'category', 'title', 'description', 'traveler_type']

class TravelTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelTip
        fields = ['id', 'category', 'title', 'description', 'traveler_type', 'destination']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'traveler_type', 'preferences', 'calendar_integration']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['preferences'] = json.loads(instance.preferences)
        data['calendar_integration'] = json.loads(instance.calendar_integration)
        return data

    def to_internal_value(self, data):
        if 'preferences' in data:
            data['preferences'] = json.dumps(data['preferences'])
        if 'calendar_integration' in data:
            data['calendar_integration'] = json.dumps(data['calendar_integration'])
        return super().to_internal_value(data)

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id', 
            'destination', 
            'latitude', 
            'longitude',
            'travel_start', 
            'travel_end',
            'traveler_type',
            'activities',
            'packing_list',
            'meeting_schedule',
            'recommendations',
            'cultural_insights',
            'travel_tips',
            'calendar_integration',
            'created_at'
        ]
        read_only_fields = ['user', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            data['activities'] = json.loads(instance.activities) if instance.activities else []
        except json.JSONDecodeError:
            data['activities'] = []
            
        try:
            data['packing_list'] = json.loads(instance.packing_list) if instance.packing_list else []
        except json.JSONDecodeError:
            data['packing_list'] = []
            
        try:
            data['meeting_schedule'] = json.loads(instance.meeting_schedule) if instance.meeting_schedule else []
        except json.JSONDecodeError:
            data['meeting_schedule'] = []
            
        try:
            data['recommendations'] = json.loads(instance.recommendations) if instance.recommendations else {}
        except json.JSONDecodeError:
            data['recommendations'] = {}
            
        try:
            data['cultural_insights'] = json.loads(instance.cultural_insights) if instance.cultural_insights else {}
        except json.JSONDecodeError:
            data['cultural_insights'] = {}
            
        try:
            data['travel_tips'] = json.loads(instance.travel_tips) if instance.travel_tips else {}
        except json.JSONDecodeError:
            data['travel_tips'] = {}
            
        try:
            data['calendar_integration'] = json.loads(instance.calendar_integration) if instance.calendar_integration else {}
        except json.JSONDecodeError:
            data['calendar_integration'] = {}
            
        return data

    def to_internal_value(self, data):
        if 'activities' in data:
            data['activities'] = json.dumps(data['activities'])
        if 'packing_list' in data:
            data['packing_list'] = json.dumps(data['packing_list'])
        if 'meeting_schedule' in data:
            data['meeting_schedule'] = json.dumps(data['meeting_schedule'])
        if 'recommendations' in data:
            data['recommendations'] = json.dumps(data['recommendations'])
        if 'cultural_insights' in data:
            data['cultural_insights'] = json.dumps(data['cultural_insights'])
        if 'travel_tips' in data:
            data['travel_tips'] = json.dumps(data['travel_tips'])
        if 'calendar_integration' in data:
            data['calendar_integration'] = json.dumps(data['calendar_integration'])
        return super().to_internal_value(data)

class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = ['id', 'role', 'story']

class KeyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFeature
        fields = ['id', 'title', 'description']

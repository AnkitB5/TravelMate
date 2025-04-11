# trips/admin.py
from django.contrib import admin
from .models import Trip, KeyFeature, UserStory, Profile

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('destination', 'travel_start', 'travel_end')

@admin.register(KeyFeature)
class KeyFeatureAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(UserStory)
class UserStoryAdmin(admin.ModelAdmin):
    list_display = ('role',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'traveler_type')

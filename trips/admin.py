# trips/admin.py
from django.contrib import admin
from .models import Trip, KeyFeature, UserStory

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('destination', 'travel_start', 'travel_end')

@admin.register(KeyFeature)
class KeyFeatureAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(UserStory)
class UserStoryAdmin(admin.ModelAdmin):
    list_display = ('role',)

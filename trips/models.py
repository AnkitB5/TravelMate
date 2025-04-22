# trips/models.py
from django.db import models
from django.contrib.auth.models import User

# Existing Trip model...
class Trip(models.Model):
    TRAVELER_TYPES = (
        ('casual', 'Casual Traveler'),
        ('business', 'Business Traveler'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    destination = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)  # Added for weather forecasting
    longitude = models.FloatField(null=True, blank=True)  # Added for weather forecasting
    travel_start = models.DateField()
    travel_end = models.DateField()
    traveler_type = models.CharField(max_length=10, choices=TRAVELER_TYPES, default='casual')
    activities = models.TextField(blank=True, default='[]')  # Store activities as JSON string
    packing_list = models.TextField(blank=True, default='[]')  # Store packing list as JSON string
    created_at = models.DateTimeField(auto_now_add=True)
    meeting_schedule = models.TextField(blank=True, default='[]')  # Store meeting schedule as JSON string
    recommendations = models.TextField(blank=True, default='{}')  # Store AI-generated recommendations as JSON string
    cultural_insights = models.TextField(blank=True, default='{}')  # Store cultural insights as JSON string
    travel_tips = models.TextField(blank=True, default='{}')  # Store travel tips as JSON string
    calendar_integration = models.TextField(blank=True, default='{}')  # Store calendar integration data as JSON string

    def __str__(self):
        return f"{self.destination} ({self.travel_start} - {self.travel_end})"

# New Models for Key Features and User Stories:
class KeyFeature(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        verbose_name = "Key Feature"
        verbose_name_plural = "Key Features"

    def __str__(self):
        return self.title


class UserStory(models.Model):
    ROLE_CHOICES = [
        ('solo', 'Solo Traveler'),
        ('family', 'Family Planner'),
        ('business', 'Business Traveler'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    story = models.TextField()

    class Meta:
        verbose_name = "User Story"
        verbose_name_plural = "User Stories"

    def __str__(self):
        return f"{self.get_role_display()} Story"
    
# trips/models.py (append this below Trip)
class Profile(models.Model):
    TRAVELER_TYPES = (
        ('casual', 'Casual Traveler'),
        ('business', 'Business Traveler'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    traveler_type = models.CharField(max_length=10, choices=TRAVELER_TYPES)
    preferences = models.TextField(default='{}')  # Store user preferences as JSON string
    calendar_integration = models.TextField(default='{}')  # Store calendar integration settings as JSON string

    def __str__(self):
        return f"{self.user.username} - {self.get_traveler_type_display()}"

class Activity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    packing_requirements = models.TextField(default='[]')  # Items needed for this activity as JSON string
    weather_considerations = models.TextField(default='{}')  # Weather-related considerations as JSON string

    def __str__(self):
        return self.name

class PackingItem(models.Model):
    CATEGORIES = (
        ('clothing', 'Clothing'),
        ('accessories', 'Accessories'),
        ('electronics', 'Electronics'),
        ('toiletries', 'Toiletries'),
        ('documents', 'Documents'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    description = models.TextField(blank=True)
    is_essential = models.BooleanField(default=False)
    weather_conditions = models.TextField(default='[]')  # Weather conditions this item is needed for as JSON string
    activity_requirements = models.ManyToManyField(Activity, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class CulturalInsight(models.Model):
    destination = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # e.g., 'dress_code', 'etiquette', 'customs'
    title = models.CharField(max_length=255)
    description = models.TextField()
    traveler_type = models.CharField(max_length=10, choices=Trip.TRAVELER_TYPES)

    def __str__(self):
        return f"{self.destination} - {self.title}"

class TravelTip(models.Model):
    CATEGORIES = (
        ('general', 'General'),
        ('business', 'Business'),
        ('cultural', 'Cultural'),
        ('safety', 'Safety'),
        ('transportation', 'Transportation'),
    )
    
    category = models.CharField(max_length=20, choices=CATEGORIES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    traveler_type = models.CharField(max_length=10, choices=Trip.TRAVELER_TYPES)
    destination = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.get_category_display()} - {self.title}"



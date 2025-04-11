# trips/models.py
from django.db import models
from django.contrib.auth.models import User

# Existing Trip model...
class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    destination = models.CharField(max_length=255)
    travel_start = models.DateField()
    travel_end = models.DateField()
    activities = models.TextField(blank=True)
    packing_list = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

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

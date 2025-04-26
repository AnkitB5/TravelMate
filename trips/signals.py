from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to automatically create a profile when a new user is registered
    This handles both regular signup and social auth (like Google) registration
    """
    if created:
        try:
            # Check if profile already exists (shouldn't happen, but just in case)
            if not hasattr(instance, 'profile'):
                # Default to casual traveler for new profiles
                Profile.objects.create(user=instance, traveler_type='casual')
                logger.info(f"Created new profile for user: {instance.username}")
        except Exception as e:
            logger.error(f"Error creating profile for {instance.username}: {str(e)}") 
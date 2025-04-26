from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter as BaseGoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import logging
import json
import requests
from trips.models import Profile

logger = logging.getLogger(__name__)

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Custom social account adapter to handle various edge cases"""
    
    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a social provider,
        but before the login is actually processed.
        """
        # Call the parent pre_social_login method
        super().pre_social_login(request, sociallogin)
        
        # Get the user from the sociallogin
        user = sociallogin.user
        
        # If the user already exists, make sure they have a profile
        if user.id:
            try:
                # Try to get the profile
                profile = Profile.objects.get(user=user)
            except Profile.DoesNotExist:
                # Create a profile if it doesn't exist
                Profile.objects.create(user=user, traveler_type='casual')
                print(f"Created profile for existing social user: {user.username}")
    
    def populate_user(self, request, sociallogin, data):
        """
        Hook that can be used to further populate the user instance.
        """
        user = super().populate_user(request, sociallogin, data)
        
        # You can set additional user properties here if needed
        # For example, you could set the traveler_type based on a social account field
        
        return user

class GoogleOAuth2Adapter(BaseGoogleOAuth2Adapter):
    """Enhanced Google OAuth2 adapter with additional logging and error handling"""
    
    def parse_token(self, data):
        """Handle both regular OAuth tokens and ID tokens from Google"""
        logger.info(f"Parsing token data: {str(data)[:50]}...")
        
        # If this looks like an ID token, fetch user info directly
        if data.get('id_token') or (isinstance(data.get('access_token'), str) and '.' in data.get('access_token', '')):
            # This appears to be a JWT token, attempt to process it directly
            logger.info("Detected JWT format, handling as ID token")
            return {'access_token': data.get('access_token') or data.get('id_token')}
        
        return super().parse_token(data)
    
    def complete_login(self, request, app, token, response):
        try:
            # Add more logging for debugging
            logger.info("Starting Google OAuth2 complete_login")
            logger.info(f"Token info: {token.__class__.__name__} - {str(token)[:30]}...")
            
            # Check if we need to handle an ID token directly
            if isinstance(token, dict) and token.get('access_token') and '.' in token['access_token']:
                logger.info("Detected ID token format, will try to handle directly")
                
                # Try to get user info directly from Google using the token
                try:
                    userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
                    headers = {'Authorization': f'Bearer {token["access_token"]}'}
                    
                    user_info_resp = requests.get(userinfo_url, headers=headers)
                    user_info = user_info_resp.json()
                    
                    logger.info(f"Successfully retrieved user info: {str(user_info)[:100]}...")
                    
                    # Add the user info to the response data
                    if 'email' in user_info:
                        response.update(user_info)
                except Exception as e:
                    logger.error(f"Error fetching user info from Google: {str(e)}")
            
            # Call parent implementation
            login = super().complete_login(request, app, token, response)
            
            # Additional debugging info
            logger.info(f"Login completed successfully for provider: {login.account.provider}")
            return login
            
        except Exception as e:
            logger.error(f"Error in Google OAuth complete_login: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            # Re-raise to let the view handle it
            raise 
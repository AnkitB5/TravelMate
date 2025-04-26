from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.contrib.auth.models import User
import json
import logging
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialApp

logger = logging.getLogger(__name__)

@csrf_exempt
def google_auth_token(request):
    logger.info("Google auth token view called")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id_token = data.get('id_token')
            
            if not id_token:
                logger.error("No ID token provided")
                return JsonResponse({'error': 'No ID token provided'}, status=400)
                
            # Verify the token with Google
            response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}')
            
            if response.status_code != 200:
                logger.error(f"Failed to verify token: {response.status_code}, {response.text}")
                return JsonResponse({'error': 'Invalid token'}, status=400)
                
            google_data = response.json()
            logger.info(f"Google data: {google_data}")
            
            # Check if we have the email
            email = google_data.get('email')
            if not email:
                logger.error("No email in the token")
                return JsonResponse({'error': 'No email in the token'}, status=400)
                
            # Get the Google OAuth Config (client ID) from the database
            # This is needed to verify the audience (aud) in the token
            try:
                google_app = SocialApp.objects.get(provider='google')
                client_id = google_app.client_id
                
                # Verify the audience
                if google_data.get('aud') != client_id:
                    logger.error(f"Token audience mismatch: {google_data.get('aud')} != {client_id}")
                    return JsonResponse({'error': 'Token audience mismatch'}, status=400)
                    
            except SocialApp.DoesNotExist:
                logger.error("Google app configuration not found")
                return JsonResponse({'error': 'Google app configuration not found'}, status=500)
                
            # Check if a user exists with this email (don't create if it doesn't exist)
            try:
                user = User.objects.get(email=email)
                logger.info(f"Found existing user with email: {email}")
            except User.DoesNotExist:
                logger.info(f"No user found with email: {email}")
                return JsonResponse({'error': 'No account exists with this email. Please sign up first.'}, status=400)

            # Login the user
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
            
        except json.JSONDecodeError:
            logger.error("Invalid JSON")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.exception(f"Error in Google auth token view: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405) 
#!/usr/bin/env python
"""
A simple script to test the password reset functionality.
"""
import requests
import json
import sys
import os
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travelmate.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

def test_password_reset_request():
    """Test the password reset request endpoint."""
    try:
        # Option to provide an email or auto-find first user
        if len(sys.argv) > 1:
            email = sys.argv[1]
        else:
            # Get the first user
            try:
                user = User.objects.first()
                if not user:
                    print("No users found in the database!")
                    return
                email = user.email
            except Exception as e:
                print(f"Error retrieving user: {str(e)}")
                return
        
        print(f"Using email: {email}")
        
        # Check if the user exists
        try:
            user = User.objects.get(email=email)
            print(f"Found user: {user.username} (ID: {user.pk})")
        except User.DoesNotExist:
            print(f"No user found with email {email}")
            return
        
        # Generate a reset token directly
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Print directly to the console
        print(f"\nGenerated reset token:")
        print(f"UID: {uid}")
        print(f"Token: {token}")
        print(f"User ID: {user.pk}")
        
        # Test the validation endpoint (optional)
        try:
            print("\nTesting token validation endpoint...")
            validate_url = f'http://localhost:8000/api/password-reset-validate/{uid}/{token}/'
            response = requests.get(validate_url)
            
            print(f"Validation Status code: {response.status_code}")
            if response.status_code == 200:
                print(f"Validation Response: {response.json()}")
            else:
                print(f"Validation Failed: {response.text}")
        except Exception as e:
            print(f"Validation test failed: {str(e)}")
        
        # Show the reset URL for manual testing with correct port
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        print(f"\nReset URL for frontend: {frontend_url}/password-reset-confirm/{uid}/{token}")
        
        # Additional debug info
        print("\nTry this command to debug the token if needed:")
        print(f"python debug_token.py {uid} {token}")
        
    except Exception as e:
        print(f"Error in test_password_reset_request: {str(e)}")

if __name__ == "__main__":
    test_password_reset_request() 
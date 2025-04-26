#!/usr/bin/env python
"""
Verification script for password reset functionality
"""
import os
import sys
import django
import json
import requests
from urllib.parse import urljoin

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travelmate.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

def get_user():
    """Get a user to test with"""
    try:
        if len(sys.argv) > 1:
            # Try to get user by username, email, or ID
            arg = sys.argv[1]
            try:
                # Try by ID
                user = User.objects.get(pk=int(arg))
                return user
            except (ValueError, User.DoesNotExist):
                # Try by username or email
                try:
                    user = User.objects.get(username=arg)
                    return user
                except User.DoesNotExist:
                    try:
                        user = User.objects.get(email=arg)
                        return user
                    except User.DoesNotExist:
                        print(f"No user found with identifier: {arg}")
                        return None
        
        # If no arg or user not found, get the first user
        return User.objects.first()
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def generate_reset_token(user):
    """Generate a password reset token for a user"""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return uid, token

def verify_reset_link(user, uid, token):
    """Verify that the password reset link works"""
    base_url = "http://localhost:8000"
    
    # 1. Test the validation endpoint
    validate_url = f"{base_url}/api/password-reset-validate/{uid}/{token}/"
    frontend_url = f"http://localhost:3000/password-reset-confirm/{uid}/{token}"
    
    print(f"User: {user.username} (ID: {user.pk})")
    print(f"Email: {user.email}")
    print(f"UID: {uid}")
    print(f"Token: {token}")
    print(f"\nValidation URL: {validate_url}")
    print(f"Frontend URL: {frontend_url}\n")
    
    try:
        print("Testing token validation...")
        response = requests.get(validate_url)
        
        if response.status_code == 200:
            print("✅ Validation successful")
            print(f"Response: {response.json()}")
        else:
            print("❌ Validation failed")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try with a new token
            print("\nGenerating a new token to try again...")
            new_uid, new_token = generate_reset_token(user)
            new_validate_url = f"{base_url}/api/password-reset-validate/{new_uid}/{new_token}/"
            new_frontend_url = f"http://localhost:3000/password-reset-confirm/{new_uid}/{new_token}"
            
            print(f"New UID: {new_uid}")
            print(f"New Token: {new_token}")
            print(f"New Frontend URL: {new_frontend_url}")
            
            try:
                response = requests.get(new_validate_url)
                if response.status_code == 200:
                    print("✅ Validation with new token successful")
                    print(f"Response: {response.json()}")
                else:
                    print("❌ Validation with new token failed")
                    print(f"Status code: {response.status_code}")
                    print(f"Response: {response.text}")
            except Exception as e:
                print(f"Error validating with new token: {e}")
    
    except Exception as e:
        print(f"Error validating token: {e}")
    
    # 2. Test setting a new password
    print("\nWould you like to test setting a new password? (y/n)")
    choice = input("> ").lower()
    
    if choice == 'y':
        confirm_url = f"{base_url}/api/password-reset-confirm/{uid}/{token}/"
        new_password = input("Enter a new password to test with: ")
        
        try:
            print(f"\nTesting password reset with URL: {confirm_url}")
            response = requests.post(
                confirm_url,
                json={
                    'new_password1': new_password,
                    'new_password2': new_password
                }
            )
            
            if response.status_code == 200:
                print("✅ Password reset successful")
                print(f"Response: {response.json()}")
            else:
                print("❌ Password reset failed")
                print(f"Status code: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error resetting password: {e}")

if __name__ == "__main__":
    print("Password Reset Verification Tool")
    print("--------------------------------")
    
    user = get_user()
    if not user:
        print("No users found in the database.")
        sys.exit(1)
    
    uid, token = generate_reset_token(user)
    verify_reset_link(user, uid, token) 
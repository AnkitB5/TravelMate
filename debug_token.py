#!/usr/bin/env python
"""
Debug script for token validation
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travelmate.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

def debug_token(uid, token):
    """Debug a password reset token"""
    print(f"Debugging UID: {uid}")
    print(f"Debugging token: {token}")
    
    try:
        # Decode the UID
        user_id = force_str(urlsafe_base64_decode(uid))
        print(f"Decoded user ID: {user_id}")
        
        # Get the user
        user = User.objects.get(pk=user_id)
        print(f"Found user: {user.username} (ID: {user.pk}, Email: {user.email})")
        
        # Check if the token is valid
        is_valid = default_token_generator.check_token(user, token)
        print(f"Is token valid? {is_valid}")
        
        # Generate a new token for comparison
        new_token = default_token_generator.make_token(user)
        print(f"New token for user: {new_token}")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python debug_token.py <uid> <token>")
        sys.exit(1)
    
    uid = sys.argv[1]
    token = sys.argv[2]
    
    success = debug_token(uid, token)
    
    if success:
        print("\nTo generate a new valid link, run:")
        print("python test_password_reset.py")
    else:
        print("\nFailed to validate token") 
#!/usr/bin/env python
"""
Test the reset link generation with email template
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travelmate.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string

def test_reset_link_generation():
    """Test the reset link generation with email template"""
    # Get the first user
    try:
        if len(sys.argv) > 1:
            email = sys.argv[1]
            user = User.objects.get(email=email)
        else:
            user = User.objects.first()
            
        if not user:
            print("No users found in the database!")
            return
    except Exception as e:
        print(f"Error getting user: {e}")
        return
    
    # Generate token
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    
    # Build reset link
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    reset_link = f"{frontend_url}/password-reset-confirm/{uid}/{token}/"
    
    # Print user and token information
    print(f"User: {user.username} (ID: {user.pk})")
    print(f"Email: {user.email}")
    print(f"UID: {uid}")
    print(f"Token: {token}")
    print(f"Reset link: {reset_link}")
    
    # Render email template
    email_context = {
        "reset_link": reset_link,
        "user": user,
    }
    
    try:
        email_body = render_to_string("password_reset_email.html", email_context)
        
        # Print rendered template
        print("\nRendered email template:")
        print("------------------------")
        print(email_body)
        
        # Check for issues in the template
        if "undefined" in email_body.lower():
            print("\n⚠️  WARNING: 'undefined' found in rendered template!")
        
        if "{{" in email_body or "}}" in email_body:
            print("\n⚠️  WARNING: Unresolved template variables found!")
            
    except Exception as e:
        print(f"Error rendering template: {e}")

if __name__ == "__main__":
    test_reset_link_generation() 
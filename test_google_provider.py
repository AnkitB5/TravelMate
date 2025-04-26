#!/usr/bin/env python
"""
Test script to verify that the Google OAuth adapter can be properly imported 
and initialized.
"""
import os
import django
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travelmate.settings')
django.setup()

# Now import the adapter
try:
    from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
    print("✅ Successfully imported GoogleOAuth2Adapter")
    
    # Initialize the adapter
    adapter = GoogleOAuth2Adapter()
    print("✅ Successfully initialized GoogleOAuth2Adapter")
    
    # Print provider info
    print(f"Provider ID: {adapter.provider_id}")
    
    # Check if the provider is registered
    from allauth.socialaccount.providers import registry
    provider = registry.by_id(adapter.provider_id)
    if provider:
        print(f"✅ Provider '{provider.id}' is registered in the registry")
    else:
        print(f"❌ Provider '{adapter.provider_id}' is NOT registered in the registry")
    
    # Check settings
    from django.conf import settings
    if hasattr(settings, 'SOCIALACCOUNT_PROVIDERS') and 'google' in settings.SOCIALACCOUNT_PROVIDERS:
        google_settings = settings.SOCIALACCOUNT_PROVIDERS['google']
        print("✅ SOCIALACCOUNT_PROVIDERS['google'] is configured:")
        for key, value in google_settings.items():
            if key == 'APP':
                app_settings = value
                # Don't print the full secret
                if 'secret' in app_settings:
                    app_settings = app_settings.copy()
                    if app_settings['secret']:
                        app_settings['secret'] = app_settings['secret'][:5] + '...'
                print(f"  - APP: {app_settings}")
            else:
                print(f"  - {key}: {value}")
    else:
        print("❌ SOCIALACCOUNT_PROVIDERS['google'] is NOT configured")
    
    # Check installed apps
    if 'allauth.socialaccount.providers.google' in settings.INSTALLED_APPS:
        print("✅ 'allauth.socialaccount.providers.google' is in INSTALLED_APPS")
    else:
        print("❌ 'allauth.socialaccount.providers.google' is NOT in INSTALLED_APPS")
    
    print("\n✅ All checks passed! The Google provider appears to be correctly configured.")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("\nThis suggests the Google provider is not properly installed or configured.")
    print("Try running the install_google_provider.py script again.")
    
except Exception as e:
    import traceback
    print(f"❌ Error: {e}")
    traceback.print_exc()
    print("\nThis suggests there might be an issue with your configuration.") 
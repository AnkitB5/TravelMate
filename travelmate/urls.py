from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import os

class GoogleLogin(SocialLoginView):
    adapter_class  = GoogleOAuth2Adapter
    client_class   = OAuth2Client
    callback_url   = os.getenv("GOOGLE_CALLBACK_URL", "http://localhost:3000")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('trips.urls')),
    path('api/trips/', include('trips.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
]
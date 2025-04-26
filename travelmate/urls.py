# travelmate/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

# Import our custom adapter and views
from .adapter import GoogleOAuth2Adapter
from .views import google_auth_token
from trips.views import password_reset_request, password_reset_confirm

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000"
    client_class = OAuth2Client
    
    # Override get_adapter to properly initialize with request
    def get_adapter(self, request):
        return self.adapter_class(request)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('trips.urls')),  # this includes the home, key features, and user stories pages
    path('api/trips/', include('trips.urls')),  # or separate out API endpoints as needed
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/google/", GoogleLogin.as_view(), name="google_login"),
    # Add our custom Google auth endpoint
    path("api/auth/google-token/", google_auth_token, name="google_auth_token"),
    
    # Password reset endpoints
    path("api/password-reset-request/", password_reset_request, name="password_reset_request"),
    path("api/password-reset-confirm/<str:uid>/<str:token>/", password_reset_confirm, name="password_reset_confirm"),
    path("api/password-reset-validate/<str:uid>/<str:token>/", password_reset_confirm, {"validate_only": True}, name="password_reset_validate"),
]

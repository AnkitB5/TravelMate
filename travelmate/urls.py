# travelmate/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('trips.urls')),  # this includes the home, key features, and user stories pages
    path('api/trips/', include('trips.urls')),  # or separate out API endpoints as needed
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # other URL configurations...
]

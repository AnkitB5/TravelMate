# trips/urls.py
from django.urls import path, include
from . import views
from django.contrib import admin

urlpatterns = [
    path('', views.home, name='home'),
    path('key-features/', views.key_features, name='key_features'),
    path('user-stories/', views.user_stories, name='user_stories'),
    path('dashboard/', views.trip_dashboard, name='trip_dashboard'),

    # Web views
    path('trips/<int:trip_id>/weather/', views.trip_weather_view, name='trip_weather'),
    # API endpoints can remain as is:
    path('api/trips/', views.TripListCreateAPIView.as_view(), name='api_trip_list'),
    path('api/trips/<int:pk>/', views.TripDetailAPIView.as_view(), name='api_trip_detail'),
    path('api/key-features/', views.KeyFeatureListAPIView.as_view(), name='api_key_features'),
    path('api/user-stories/', views.UserStoryListAPIView.as_view(), name='api_user_stories'),
    path('api/signup/', views.signup, name='api_signup'),
    path('admin/', admin.site.urls),
    ##path('', include('trips.urls')),
    # Weather API endpoints:
    path('api/trips/<int:trip_id>/weather/', views.trip_weather_forecast, name='trip_weather_forecast'),
    path('api/trips/<int:trip_id>/clothing-recommendations/', views.trip_clothing_recommendations, name='trip_clothing_recommendations'),
    # City search API endpoint:
    path('api/cities/search/', views.search_cities, name='search_cities'),
]

# trips/urls.py
from django.urls import path, include
from . import views
from django.contrib import admin
from . import api_views

urlpatterns = [
    path('', views.home, name='home'),
    path('key-features/', views.key_features, name='key_features'),
    path('user-stories/', views.user_stories, name='user_stories'),
    path('dashboard/', views.trip_dashboard, name='trip_dashboard'),

    # Web views
    path('trips/<int:trip_id>/weather/', views.trip_weather_view, name='trip_weather'),
    # API endpoints
    path('api/trips/', api_views.TripListCreateView.as_view(), name='api_trip_list'),
    path('api/trips/<int:pk>/', api_views.TripDetailView.as_view(), name='api_trip_detail'),
    path('api/trips/<int:trip_id>/weather/', views.trip_weather_forecast, name='trip_weather_forecast'),
    path('api/trips/<int:trip_id>/recommendations/', api_views.trip_recommendations, name='trip_recommendations'),
    path('api/trips/<int:trip_id>/cultural-insights/', api_views.trip_cultural_insights, name='trip_cultural_insights'),
    path('api/trips/<int:trip_id>/travel-tips/', api_views.trip_travel_tips, name='trip_travel_tips'),
    path('api/trips/<int:trip_id>/packing-list/', api_views.trip_packing_list, name='trip_packing_list'),
    
    # Activities and packing items
    path('api/activities/', api_views.ActivityListCreateView.as_view(), name='api_activities'),
    path('api/packing-items/', api_views.PackingItemListCreateView.as_view(), name='api_packing_items'),
    
    # Cultural insights and travel tips
    path('api/cultural-insights/', api_views.CulturalInsightListView.as_view(), name='api_cultural_insights'),
    path('api/travel-tips/', api_views.TravelTipListView.as_view(), name='api_travel_tips'),
    
    # User profile
    path('api/profile/', api_views.ProfileRetrieveUpdateView.as_view(), name='api_profile'),
    
    # Authentication endpoints
    path('api/signup/', views.signup, name='api_signup'),
    path('api/password-reset/', views.password_reset_request, name='password_reset_request'),
    path('api/password-reset/<uidb64>/<token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('admin/', admin.site.urls),
    ##path('', include('trips.urls')),
    # Weather API endpoints:
    path('api/trips/<int:trip_id>/clothing-recommendations/', views.trip_clothing_recommendations, name='trip_clothing_recommendations'),
    # City search API endpoint:
    path('api/cities/search/', views.search_cities, name='search_cities'),
]

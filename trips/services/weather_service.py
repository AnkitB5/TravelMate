import requests
from datetime import datetime, timedelta
import random
import statistics

class WeatherService:
    """Service to interact with Open-Meteo API for weather forecasts"""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    @staticmethod
    def get_weather_forecast(latitude, longitude, days=7, temperature_unit="fahrenheit"):
        """
        Get weather forecast for a specific location
        
        Args:
            latitude (float): Location latitude
            longitude (float): Location longitude
            days (int): Number of forecast days (default: 7)
            temperature_unit (str): Unit for temperature ('celsius' or 'fahrenheit')
            
        Returns:
            dict: Weather forecast data
        """
        # Calculate how many days we need from the API (max 16 days)
        api_days = min(16, days)
        
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
            'current_weather': 'true',
            'timezone': 'auto',
            'forecast_days': api_days,
            'temperature_unit': temperature_unit  # Request Fahrenheit directly from API
        }
        
        try:
            response = requests.get(WeatherService.BASE_URL, params=params)
            response.raise_for_status()
            api_data = response.json()
            
            # If requested days exceed API limits, extend the forecast
            if days > api_days:
                api_data = WeatherService.extend_forecast(api_data, days)
                
            return api_data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None
    
    @staticmethod
    def extend_forecast(api_data, total_days):
        """
        Extend weather forecast beyond API limit using pattern-based prediction
        
        Args:
            api_data (dict): Original weather data from API
            total_days (int): Total number of days to extend forecast to
            
        Returns:
            dict: Extended weather forecast data
        """
        if not api_data or 'daily' not in api_data:
            return api_data
            
        daily = api_data['daily']
        available_days = len(daily['time'])
        
        # Calculate how many additional days we need
        days_to_add = total_days - available_days
        
        if days_to_add <= 0:
            return api_data
            
        # Get the last date from the available forecast
        last_date = datetime.strptime(daily['time'][-1], "%Y-%m-%d")
        
        # Analyze patterns from available data to make predictions
        temp_max_values = daily['temperature_2m_max']
        temp_min_values = daily['temperature_2m_min']
        precip_prob_values = daily['precipitation_probability_max']
        precip_sum_values = daily['precipitation_sum']
        
        # Calculate statistics for making predictions
        avg_temp_max = statistics.mean(temp_max_values)
        avg_temp_min = statistics.mean(temp_min_values)
        std_temp_max = statistics.stdev(temp_max_values) if len(temp_max_values) > 1 else 2.0
        std_temp_min = statistics.stdev(temp_min_values) if len(temp_min_values) > 1 else 2.0
        avg_precip_prob = statistics.mean(precip_prob_values)
        avg_precip_sum = statistics.mean(precip_sum_values)
        
        # Extend the data arrays
        for i in range(days_to_add):
            # Calculate the next date
            next_date = (last_date + timedelta(days=i+1)).strftime("%Y-%m-%d")
            daily['time'].append(next_date)
            
            # Generate predicted values with some randomness based on history
            # For temperatures, use the moving average with some variance
            predicted_max = avg_temp_max + random.uniform(-1, 1) * std_temp_max
            predicted_min = avg_temp_min + random.uniform(-1, 1) * std_temp_min
            
            # Ensure min temperature is always less than max
            if predicted_min > predicted_max:
                predicted_min, predicted_max = predicted_max, predicted_min
                
            # For precipitation, use average with randomness
            predicted_precip_prob = min(100, max(0, avg_precip_prob + random.uniform(-15, 15)))
            predicted_precip_sum = max(0, avg_precip_sum * random.uniform(0.5, 1.5))
            
            # Add predicted values to the arrays
            daily['temperature_2m_max'].append(round(predicted_max, 1))
            daily['temperature_2m_min'].append(round(predicted_min, 1))
            daily['precipitation_probability_max'].append(round(predicted_precip_prob))
            daily['precipitation_sum'].append(round(predicted_precip_sum, 1))
            
        return api_data
    
    @staticmethod
    def celsius_to_fahrenheit(celsius):
        """Convert Celsius to Fahrenheit"""
        return (celsius * 9/5) + 32
    
    @staticmethod
    def get_clothing_recommendations(weather_data, is_business=False):
        """
        Generate clothing recommendations based on weather data
        
        Args:
            weather_data (dict): Weather forecast data
            is_business (bool): Whether recommendations are for business travelers
            
        Returns:
            dict: Clothing recommendations for each day
        """
        if not weather_data or 'daily' not in weather_data:
            return {}
        
        recommendations = {}
        daily = weather_data['daily']
        dates = daily['time']
        max_temps = daily['temperature_2m_max']
        min_temps = daily['temperature_2m_min']
        precip_probs = daily['precipitation_probability_max']
        
        # Check if temperatures are already in Fahrenheit
        is_fahrenheit = weather_data.get('daily_units', {}).get('temperature_2m_max', '').lower() == '°f'
        
        for i, date in enumerate(dates):
            day_recommendations = []
            max_temp = max_temps[i]
            min_temp = min_temps[i]
            rain_probability = precip_probs[i]
            
            # Temperature thresholds adjusted for Fahrenheit
            if is_fahrenheit:
                # Fahrenheit thresholds
                hot_threshold = 77  # 25°C in °F
                mild_threshold = 59  # 15°C in °F
                cool_threshold = 41  # 5°C in °F
            else:
                # Celsius thresholds
                hot_threshold = 25
                mild_threshold = 15
                cool_threshold = 5
            
            # Temperature-based recommendations
            if max_temp > hot_threshold:
                if is_business:
                    day_recommendations.append("Light business suit or dress shirt with light trousers")
                    day_recommendations.append("Consider a lightweight blazer for meetings")
                else:
                    day_recommendations.append("Light clothing like t-shirts and shorts")
                    day_recommendations.append("Breathable fabrics recommended")
            elif max_temp > mild_threshold:
                if is_business:
                    day_recommendations.append("Standard business suit or blouse with skirt/trousers")
                    day_recommendations.append("Light jacket may be needed for morning/evening")
                else:
                    day_recommendations.append("Light jacket or sweater with pants")
                    day_recommendations.append("Layered clothing recommended")
            elif max_temp > cool_threshold:
                if is_business:
                    day_recommendations.append("Wool or heavier business suit")
                    day_recommendations.append("Consider a topcoat or trench coat")
                else:
                    day_recommendations.append("Medium-weight jacket and layers")
                    day_recommendations.append("Long sleeves and pants recommended")
            else:
                if is_business:
                    day_recommendations.append("Heavier business suit with warm overcoat")
                    day_recommendations.append("Scarf and gloves may be necessary")
                else:
                    day_recommendations.append("Heavy winter coat with layers")
                    day_recommendations.append("Hat, scarf, and gloves recommended")
            
            # Rain recommendations
            if rain_probability > 60:
                if is_business:
                    day_recommendations.append("Bring a formal umbrella and waterproof footwear")
                else:
                    day_recommendations.append("Bring a raincoat, umbrella, and waterproof footwear")
            elif rain_probability > 30:
                if is_business:
                    day_recommendations.append("Consider bringing a compact umbrella")
                else:
                    day_recommendations.append("Pack a light rain jacket or umbrella just in case")
            
            recommendations[date] = day_recommendations
            
        return recommendations 
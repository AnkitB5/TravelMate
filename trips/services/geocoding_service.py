import requests

class GeocodingService:
    """Service to handle geocoding (converting place names to coordinates)"""
    
    BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"
    
    @staticmethod
    def get_coordinates(location_name):
        """
        Get latitude and longitude for a location name
        
        Args:
            location_name (str): Name of the location to geocode
            
        Returns:
            tuple: (latitude, longitude) or (None, None) if not found
        """
        try:
            params = {
                'name': location_name,
                'count': 1,
                'language': 'en',
                'format': 'json'
            }
            
            response = requests.get(GeocodingService.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data and 'results' in data and len(data['results']) > 0:
                result = data['results'][0]
                return result['latitude'], result['longitude']
            
            return None, None
            
        except requests.exceptions.RequestException as e:
            print(f"Error during geocoding: {e}")
            return None, None
    
    @staticmethod
    def search_cities(query, limit=10):
        """
        Search for cities matching the query
        
        Args:
            query (str): Search term for city name
            limit (int): Maximum number of results to return
            
        Returns:
            list: List of city dictionaries with name, country, latitude, longitude
        """
        try:
            params = {
                'name': query,
                'count': limit,
                'language': 'en',
                'format': 'json'
            }
            
            response = requests.get(GeocodingService.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            cities = []
            if data and 'results' in data:
                for result in data['results']:
                    city = {
                        'name': result.get('name', ''),
                        'country': result.get('country', ''),
                        'admin1': result.get('admin1', ''),  # State/province
                        'latitude': result.get('latitude'),
                        'longitude': result.get('longitude')
                    }
                    
                    # Create a formatted display name with country and admin1 if available
                    display_parts = [city['name']]
                    if city['admin1']:
                        display_parts.append(city['admin1'])
                    if city['country']:
                        display_parts.append(city['country'])
                    
                    city['display_name'] = ', '.join(display_parts)
                    cities.append(city)
            
            return cities
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching cities: {e}")
            return [] 
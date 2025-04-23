import api from './api';

export const getAITripRecommendations = async (tripData) => {
  try {
    const response = await api.post('/api/trips/ai-recommendations/', {
      destination: tripData.destination,
      travel_start: tripData.travel_start,
      travel_end: tripData.travel_end,
      traveler_type: tripData.traveler_type,
      activities: tripData.activities || []
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

export const getAIPackingSuggestions = async (tripData) => {
  try {
    const response = await api.post('/api/trips/ai-packing-suggestions/', {
      destination: tripData.destination,
      travel_start: tripData.travel_start,
      travel_end: tripData.travel_end,
      traveler_type: tripData.traveler_type,
      activities: tripData.activities || []
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI packing suggestions:', error);
    throw error;
  }
};

export const getAITravelTips = async (tripData) => {
  try {
    const response = await api.post('/api/trips/ai-travel-tips/', {
      destination: tripData.destination,
      traveler_type: tripData.traveler_type,
      activities: tripData.activities || []
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI travel tips:', error);
    throw error;
  }
}; 
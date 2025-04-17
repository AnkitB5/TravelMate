import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';
import CitySearch from './CitySearch';
import api from '../services/api';

const EditTripForm = ({ open, onClose, trip, onSave }) => {
  const [formData, setFormData] = useState({
    destination: '',
    travel_start: '',
    travel_end: '',
    activities: '',
    meeting_schedule: ''
  });
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trip) {
      setFormData({
        destination: trip.destination || '',
        travel_start: trip.travel_start || '',
        travel_end: trip.travel_end || '',
        activities: trip.activities || '',
        meeting_schedule: trip.meeting_schedule || ''
      });
      
      // Create a city object from the trip data
      if (trip.latitude && trip.longitude) {
        setSelectedCity({
          name: trip.destination.split(',')[0],
          display_name: trip.destination,
          latitude: trip.latitude,
          longitude: trip.longitude
        });
      }
    }
  }, [trip]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (city) {
      setFormData({
        ...formData,
        destination: city.display_name
      });
    }
  };

  const handleSubmit = async () => {
    // Validate city selection
    if (!selectedCity) {
      setError('Please select a valid city for accurate weather data');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the data with coordinates
      const updateData = {
        ...formData,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude
      };
      
      // Make the API call to update the trip
      const response = await api.put(`/api/trips/${trip.id}/`, updateData);
      
      // Call the onSave callback with updated trip
      onSave(response.data);
      
      // Close the dialog
      onClose();
    } catch (err) {
      console.error('Error updating trip:', err);
      setError('Failed to update trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Trip</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <CitySearch
          value={selectedCity}
          onChange={handleCitySelect}
          error={!!error && !selectedCity}
          helperText="Select a city from the dropdown for accurate weather data"
        />
        
        <TextField
          label="Start Date"
          name="travel_start"
          type="date"
          value={formData.travel_start}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        
        <TextField
          label="End Date"
          name="travel_end"
          type="date"
          value={formData.travel_end}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        
        <TextField
          label="Activities"
          name="activities"
          multiline
          rows={2}
          value={formData.activities}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        
        {localStorage.getItem('traveler_type') === 'business' && (
          <TextField
            label="Meeting Schedule"
            name="meeting_schedule"
            multiline
            rows={2}
            value={formData.meeting_schedule}
            onChange={handleChange}
            fullWidth
            margin="normal"
            helperText="Enter your meeting schedule for formal recommendations."
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTripForm; 
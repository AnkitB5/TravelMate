// src/components/TripDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, TextField, Button, Snackbar, Box, Alert, Fade } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import TripCard from './TripCard';
import CitySearch from './CitySearch';
import api from '../services/api';

const TripDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    travel_start: '',
    travel_end: '',
    activities: '',
    meeting_schedule: ''
  });
  const [selectedCity, setSelectedCity] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read search query from URL, defaulting to an empty string
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTrips();
    }
  }, [navigate]);

  const fetchTrips = () => {
    api.get('/api/trips/')
      .then(res => setTrips(res.data))
      .catch(err => console.error('Error fetching trips:', err));
  };

  const handleChange = (e) => {
    setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (city) {
      setNewTrip({
        ...newTrip,
        destination: city.display_name,
      });
    }
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedCity) {
      setErrorMessage('Please select a valid city from the dropdown');
      return;
    }

    if (newTrip.travel_start && newTrip.travel_end) {
      const startDate = new Date(newTrip.travel_start);
      const endDate = new Date(newTrip.travel_end);
      if (startDate > endDate) {
        setErrorMessage('Start date cannot be after end date');
        return;
      }
    }

    setIsSubmitting(true);

    const tripData = {
      ...newTrip,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude
    };

    api.post('/api/trips/', tripData)
      .then(res => {
        // Option 1: update state directly and clear the search query so the new trip shows
        setTrips([...trips, res.data]);
        setNewTrip({ destination: '', travel_start: '', travel_end: '', activities: '', meeting_schedule: '' });
        setSelectedCity(null);
        setAlertOpen(true);
        setErrorMessage('');
        // Clear the URL search query to ensure the created trip is visible
        navigate('/dashboard');
      })
      .catch(err => {
        console.error('Error creating trip:', err);
        setErrorMessage('Failed to create trip. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleTripUpdated = (updatedTrip) => {
    setTrips(trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
    setAlertOpen(true);
  };

  const handleTripDeleted = (tripId) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
    setAlertOpen(true);
  };

  // Filter trips using the search query from the URL (case insensitive)
  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const travelerType = localStorage.getItem('traveler_type'); // 'casual' or 'business'

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f7f7', pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Trips</Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>

        {filteredTrips.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No trips found. Create your first trip!
          </Alert>
        )}

        <Grid container spacing={3}>
          {filteredTrips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard 
                trip={trip} 
                onTripUpdated={handleTripUpdated} 
                onDelete={handleTripDeleted} 
              />
            </Grid>
          ))}
        </Grid>

        <Fade in={true} timeout={1000}>
          <Paper sx={{ padding: '1.5rem', marginTop: '2rem' }} elevation={3}>
            <Typography variant="h5" gutterBottom>
              Create a New Trip
            </Typography>
            
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            
            <form onSubmit={handleCreateTrip} noValidate>
              <CitySearch 
                value={selectedCity}
                onChange={handleCitySelect}
                error={!!errorMessage && !selectedCity}
                helperText="Select a city from the dropdown for accurate weather data"
              />
              
              <TextField
                label="Start Date"
                name="travel_start"
                value={newTrip.travel_start}
                onChange={handleChange}
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="End Date"
                name="travel_end"
                value={newTrip.travel_end}
                onChange={handleChange}
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Activities"
                name="activities"
                value={newTrip.activities}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
              {travelerType === 'business' && (
                <TextField
                  label="Meeting Schedule"
                  name="meeting_schedule"
                  value={newTrip.meeting_schedule}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                  helperText="Enter your meeting schedule for formal recommendations."
                />
              )}
              <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Create Trip
              </Button>
            </form>
          </Paper>
        </Fade>

        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
          message="Trip created successfully!"
        />
      </Container>
    </Box>
  );
};

export default TripDashboard;

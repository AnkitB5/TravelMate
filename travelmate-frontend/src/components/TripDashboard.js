// src/components/TripDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, TextField, Button, Snackbar, Box, Alert, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TripCard from './TripCard';
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
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleCreateTrip = (e) => {
    e.preventDefault();
    // Send only the fields that belong to the trip.
    api.post('/api/trips/', newTrip)
      .then(res => {
        setTrips([...trips, res.data]);
        setNewTrip({ destination: '', travel_start: '', travel_end: '', activities: '', meeting_schedule: '' });
        setAlertOpen(true);
      })
      .catch(err => console.error('Error creating trip:', err));
  };
  

  // Get traveler type (if needed)
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

        {trips.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No trips found. Create your first trip!
          </Alert>
        )}

        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard trip={trip} onEdit={() => {}} onDelete={() => {}} />
            </Grid>
          ))}
        </Grid>

        <Fade in={true} timeout={1000}>
          <Paper sx={{ padding: '1.5rem', marginTop: '2rem' }} elevation={3}>
            <Typography variant="h5" gutterBottom>
              Create a New Trip
            </Typography>
            <form onSubmit={handleCreateTrip} noValidate>
              <TextField
                label="Destination"
                name="destination"
                value={newTrip.destination}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
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

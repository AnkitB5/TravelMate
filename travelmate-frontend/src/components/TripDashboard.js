// src/components/TripDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, TextField, Button, Snackbar, Box } from '@mui/material';
import TripCard from './TripCard';
import api from '../services/api';

const TripDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    travel_start: '',
    travel_end: '',
    activities: '',
  });
  const [alertOpen, setAlertOpen] = useState(false);

  // Fetch trips from Django backend
  useEffect(() => {
    api.get('/api/trips/')
      .then(res => setTrips(res.data))
      .catch(err => console.error('Error fetching trips:', err));
  }, []);

  const handleChange = (e) => {
    setNewTrip({
      ...newTrip,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    api.post('/api/trips/', newTrip)
      .then(res => {
        setTrips([...trips, res.data]);
        setNewTrip({ destination: '', travel_start: '', travel_end: '', activities: '' });
        setAlertOpen(true);
      })
      .catch(err => console.error('Error creating trip:', err));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f7f7', pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          My Trips
        </Typography>

        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ padding: '1rem', marginTop: '2rem' }} elevation={3}>
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
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
              Create Trip
            </Button>
          </form>
        </Paper>

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

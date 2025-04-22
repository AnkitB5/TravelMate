// src/components/TripDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../services/api';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [culturalInsights, setCulturalInsights] = useState([]);
  const [travelTips, setTravelTips] = useState([]);
  const [packingList, setPackingList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    packing_requirements: [],
    weather_considerations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const [tripResponse, insightsResponse, tipsResponse, packingResponse, weatherResponse] = await Promise.all([
        api.get(`/api/trips/${tripId}/`),
        api.get(`/api/trips/${tripId}/cultural-insights/`),
        api.get(`/api/trips/${tripId}/travel-tips/`),
        api.get(`/api/trips/${tripId}/packing-list/`),
        api.get(`/api/trips/${tripId}/weather/`)
      ]);

      setTrip(tripResponse.data);
      setCulturalInsights(insightsResponse.data);
      setTravelTips(tipsResponse.data);
      setPackingList(packingResponse.data);
      setWeather(weatherResponse.data);
      setError(null);
    } catch (err) {
      setError('Error loading trip details. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    try {
      await api.post(`/api/trips/${tripId}/activities/`, newActivity);
      setOpenActivityDialog(false);
      setNewActivity({
        name: '',
        description: '',
        date: '',
        location: '',
        packing_requirements: [],
        weather_considerations: []
      });
      fetchTripDetails();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography align="center">
          Trip not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/trips')}
        sx={{ mb: 2 }}
      >
        Back to Trips
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {trip.destination}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="textSecondary">
              Dates
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(trip.travel_start).toLocaleDateString()} - {new Date(trip.travel_end).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {trip.description || 'No description provided'}
            </Typography>
          </Grid>

          {/* Additional sections can be added here as the trip model expands */}
          {/* For example: Itinerary, Expenses, Notes, etc. */}
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Weather Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weather Forecast</Typography>
              {weather && (
                <List>
                  {weather.forecast.map((day, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={new Date(day.date).toLocaleDateString()}
                        secondary={`${day.temperature}°C - ${day.conditions}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Packing List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Packing List</Typography>
              <List>
                {packingList.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.name}
                      secondary={item.weather_conditions.join(', ')}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Activities</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenActivityDialog(true)}
                >
                  Add Activity
                </Button>
              </Box>
              <List>
                {trip.activities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={activity.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {activity.date} - {activity.location}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {activity.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < trip.activities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Cultural Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cultural Insights</Typography>
              <List>
                {culturalInsights.map((insight, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={insight.title}
                      secondary={insight.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Travel Tips */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Travel Tips</Typography>
              <List>
                {travelTips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={tip.title}
                      secondary={tip.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Activity Dialog */}
      <Dialog open={openActivityDialog} onClose={() => setOpenActivityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Activity</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          />
          <TextField
            label="Date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newActivity.date}
            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={newActivity.location}
            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActivityDialog(false)}>Cancel</Button>
          <Button onClick={handleAddActivity} variant="contained" color="primary">
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TripDetails;

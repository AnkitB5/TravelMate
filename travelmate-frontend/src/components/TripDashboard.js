// src/components/TripDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Grid, Card, CardContent,
  CardActions, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Box, CircularProgress, Alert, Tabs, Tab, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton, Chip,
  Divider, Switch, FormControlLabel, ListItemIcon
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const TripDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [packingList, setPackingList] = useState([]);
  const [culturalInsights, setCulturalInsights] = useState([]);
  const [travelTips, setTravelTips] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    travel_start: null,
    travel_end: null,
    traveler_type: localStorage.getItem('traveler_type') || 'casual',
    activities: [],
    meeting_schedule: [],
    gender: 'unisex',
    style_preference: 'casual',
    calendar_integration: false
  });
  const navigate = useNavigate();

  // Add available activities
  const availableActivities = [
    { id: 'hiking', name: 'Hiking', icon: 'hiking' },
    { id: 'beach', name: 'Beach', icon: 'beach' },
    { id: 'sightseeing', name: 'Sightseeing', icon: 'sightseeing' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping' },
    { id: 'dining', name: 'Dining', icon: 'dining' },
    { id: 'business', name: 'Business Meetings', icon: 'business' },
    { id: 'sports', name: 'Sports', icon: 'sports' },
    { id: 'nightlife', name: 'Nightlife', icon: 'nightlife' },
    { id: 'cultural', name: 'Cultural Events', icon: 'cultural' },
    { id: 'adventure', name: 'Adventure Sports', icon: 'adventure' }
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchTrips();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/profile/');
      setUserProfile(response.data);
      setFormData(prev => ({
        ...prev,
        traveler_type: response.data.traveler_type
      }));
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/trips/');
      setTrips(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (tripId) => {
    try {
      const [weather, packing, insights, tips] = await Promise.all([
        api.get(`/api/trips/${tripId}/weather/`),
        api.get(`/api/trips/${tripId}/packing-list/`),
        api.get(`/api/trips/${tripId}/cultural-insights/`),
        api.get(`/api/trips/${tripId}/travel-tips/`)
      ]);
      
      setWeatherData(weather.data);
      setPackingList(packing.data);
      setCulturalInsights(insights.data);
      setTravelTips(tips.data);
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setError('Failed to load trip details. Please try again.');
    }
  };

  // Helper function to get the weather icon based on conditions
  const getWeatherIcon = (precipitation) => {
    if (precipitation > 80) {
      return <ThunderstormIcon fontSize="large" sx={{ color: '#6200ea' }} />;
    } else if (precipitation > 60) {
      return <UmbrellaIcon fontSize="large" sx={{ color: '#0277bd' }} />;
    } else if (precipitation > 30) {
      return <CloudIcon fontSize="large" sx={{ color: '#78909c' }} />;
    } else if (precipitation > 10) {
      return <CloudIcon fontSize="large" sx={{ color: '#b0bec5' }} />;
    } else {
      return <WbSunnyIcon fontSize="large" sx={{ color: '#ff9800' }} />;
    }
  };

  // Get temperature color based on value
  const getTempColor = (temp) => {
    if (temp >= 90) return '#e53935'; // Hot (red)
    if (temp >= 80) return '#ff7043'; // Warm (orange)
    if (temp >= 70) return '#ffb74d'; // Pleasant warm (light orange)
    if (temp >= 60) return '#aed581'; // Pleasant cool (light green)
    if (temp >= 45) return '#4fc3f7'; // Cool (light blue)
    if (temp >= 32) return '#29b6f6'; // Cold (blue)
    return '#9575cd'; // Very cold (purple)
  };

  const handleOpenDialog = (trip = null) => {
    if (trip) {
      setFormData({
        ...trip,
        travel_start: new Date(trip.travel_start),
        travel_end: new Date(trip.travel_end)
      });
      setSelectedTrip(trip);
    } else {
      setFormData({
        destination: '',
        travel_start: null,
        travel_end: null,
        traveler_type: userProfile?.traveler_type || 'casual',
        activities: [],
        meeting_schedule: [],
        gender: 'unisex',
        style_preference: 'casual',
        calendar_integration: false
      });
      setSelectedTrip(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTrip) {
        await api.put(`/api/trips/${selectedTrip.id}/`, formData);
      } else {
        await api.post('/api/trips/', formData);
      }
      handleCloseDialog();
      fetchTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
      setError('Failed to save trip. Please try again.');
    }
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await api.delete(`/api/trips/${tripId}/`);
        fetchTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
        setError('Failed to delete trip. Please try again.');
      }
    }
  };

  const handleAddMeeting = () => {
    setFormData({
      ...formData,
      meeting_schedule: [
        ...formData.meeting_schedule,
        { time: '', location: '', description: '' }
      ]
    });
  };

  const handleMeetingChange = (index, field, value) => {
    const updatedMeetings = [...formData.meeting_schedule];
    updatedMeetings[index][field] = value;
    setFormData({ ...formData, meeting_schedule: updatedMeetings });
  };

  const handleRemoveMeeting = (index) => {
    const updatedMeetings = formData.meeting_schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, meeting_schedule: updatedMeetings });
  };

  const handleViewDetails = (tripId) => {
    navigate(`/trips/${tripId}/weather`);
  };

  const handleActivityToggle = (activityId) => {
    setFormData(prev => {
      const activities = [...prev.activities];
      const index = activities.indexOf(activityId);
      if (index === -1) {
        activities.push(activityId);
      } else {
        activities.splice(index, 1);
      }
      return { ...prev, activities };
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4">My Trips</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
            >
              Add New Trip
            </Button>
          </Grid>
        </Grid>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="All Trips" />
          <Tab label="Casual Trips" />
          <Tab label="Business Trips" />
        </Tabs>

        <Grid container spacing={3}>
          {trips
            .filter(trip => {
              if (activeTab === 1) return trip.traveler_type === 'casual';
              if (activeTab === 2) return trip.traveler_type === 'business';
              return true;
            })
            .map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{trip.destination}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(trip.travel_start).toLocaleDateString()} - {new Date(trip.travel_end).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={trip.traveler_type === 'business' ? 'Business Trip' : 'Casual Trip'}
                      color={trip.traveler_type === 'business' ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(trip.id)}
                    >
                      View Details
                    </Button>
                    <Button size="small" onClick={() => handleOpenDialog(trip)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(trip.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedTrip ? 'Edit Trip' : 'Add New Trip'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Destination"
                    fullWidth
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={formData.travel_start}
                      onChange={(date) => setFormData({ ...formData, travel_start: date })}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={formData.travel_end}
                      onChange={(date) => setFormData({ ...formData, travel_end: date })}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Traveler Type</InputLabel>
                    <Select
                      value={formData.traveler_type}
                      onChange={(e) => setFormData({ ...formData, traveler_type: e.target.value })}
                      required
                    >
                      <MenuItem value="casual">Casual Traveler</MenuItem>
                      <MenuItem value="business">Business Traveler</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {userProfile?.traveler_type === 'casual' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="unisex">Unisex</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Style Preference</InputLabel>
                        <Select
                          value={formData.style_preference}
                          onChange={(e) => setFormData({ ...formData, style_preference: e.target.value })}
                        >
                          <MenuItem value="casual">Casual</MenuItem>
                          <MenuItem value="sporty">Sporty</MenuItem>
                          <MenuItem value="elegant">Elegant</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {userProfile?.traveler_type === 'business' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Meeting Schedule
                      </Typography>
                      {formData.meeting_schedule.map((meeting, index) => (
                        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Time"
                              type="time"
                              value={meeting.time}
                              onChange={(e) => handleMeetingChange(index, 'time', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Location"
                              value={meeting.location}
                              onChange={(e) => handleMeetingChange(index, 'location', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Description"
                              value={meeting.description}
                              onChange={(e) => handleMeetingChange(index, 'description', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton onClick={() => handleRemoveMeeting(index)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddMeeting}
                        sx={{ mt: 2 }}
                      >
                        Add Meeting
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.calendar_integration}
                            onChange={(e) => setFormData({ ...formData, calendar_integration: e.target.checked })}
                          />
                        }
                        label="Integrate with Calendar"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedTrip ? 'Save Changes' : 'Create Trip'}
            </Button>
          </DialogActions>
        </Dialog>

        {selectedTrip && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Trip Details: {selectedTrip.destination}
            </Typography>
            
            <Grid container spacing={3}>
              {weatherData && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Weather Forecast
                    </Typography>
                    <Grid container spacing={2}>
                      {weatherData.daily?.time?.map((date, index) => {
                        const isTripDay = weatherData.trip_days?.[index];
                        return (
                          <Grid item xs={12} sm={6} md={4} key={date}>
                            <Card 
                              sx={{ 
                                bgcolor: isTripDay ? 'background.paper' : 'grey.100',
                                opacity: isTripDay ? 1 : 0.7
                              }}
                            >
                              <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="h6">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </Typography>
                                  {getWeatherIcon(weatherData.daily.precipitation_probability_max[index])}
                                </Box>
                                <Box mt={2}>
                                  <Typography variant="h4" sx={{ color: getTempColor(weatherData.daily.temperature_2m_max[index]) }}>
                                    {Math.round(weatherData.daily.temperature_2m_max[index])}°F
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Low: {Math.round(weatherData.daily.temperature_2m_min[index])}°F
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Rain: {weatherData.daily.precipitation_probability_max[index]}%
                                  </Typography>
                                </Box>
                                {isTripDay && (
                                  <Box mt={2}>
                                    <Typography variant="subtitle2" color="primary">
                                      Clothing Recommendations:
                                    </Typography>
                                    <List dense>
                                      {weatherData.recommendations?.[date]?.map((rec, i) => (
                                        <ListItem key={i}>
                                          <ListItemIcon>
                                            <CheckCircleIcon color="primary" fontSize="small" />
                                          </ListItemIcon>
                                          <ListItemText primary={rec} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {packingList.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Packing List
                    </Typography>
                    <List>
                      {packingList.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item.name} secondary={item.category} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {culturalInsights.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Cultural Insights
                    </Typography>
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
                  </Paper>
                </Grid>
              )}

              {travelTips.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Travel Tips
                    </Typography>
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
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TripDashboard;

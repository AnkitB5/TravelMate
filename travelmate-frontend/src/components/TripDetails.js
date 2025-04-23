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
  CircularProgress,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Business as BusinessIcon, 
  Delete as DeleteIcon,
  Event as EventIcon,
  Add as AddIcon,
  LocationOn,
  CalendarToday,
  AddCircleOutline,
  PlaylistAdd as PlaylistAddIcon,
  DirectionsRun as DirectionsRunIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MeetingsList from './MeetingsList';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [culturalInsights, setCulturalInsights] = useState([]);
  const [travelTips, setTravelTips] = useState([]);
  const [packingList, setPackingList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [meetingSchedule, setMeetingSchedule] = useState([]);
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
  const [isBusinessTraveler, setIsBusinessTraveler] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [openMeetingsDialog, setOpenMeetingsDialog] = useState(false);

  useEffect(() => {
    fetchTripDetails();
    // Check if user is a business traveler
    const travelerType = localStorage.getItem('traveler_type');
    setIsBusinessTraveler(travelerType === 'business');
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
      
      // Parse meeting schedule if it exists and user is a business traveler
      if (tripResponse.data.meeting_schedule && tripResponse.data.traveler_type === 'business') {
        try {
          const meetingData = typeof tripResponse.data.meeting_schedule === 'string'
            ? JSON.parse(tripResponse.data.meeting_schedule)
            : tripResponse.data.meeting_schedule;
          setMeetingSchedule(Array.isArray(meetingData) ? meetingData : []);
        } catch (err) {
          console.error('Error parsing meeting schedule:', err);
          setMeetingSchedule([]);
        }
      }
      
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

  const handleAddMeeting = async () => {
    try {
      // Validate meeting data
      if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
        alert('Please fill in the required fields (Title, Date, and Time)');
        return;
      }

      // Create updated meeting schedule
      const updatedSchedule = [...meetingSchedule, { ...newMeeting, id: Date.now() }];
      
      // Update the trip with the new meeting schedule
      await api.patch(`/api/trips/${tripId}/`, {
        meeting_schedule: JSON.stringify(updatedSchedule)
      });
      
      // Reset form and close dialog
      setMeetingSchedule(updatedSchedule);
      setOpenMeetingDialog(false);
      setNewMeeting({
        title: '',
        date: '',
        time: '',
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding meeting:', error);
      alert('Failed to add meeting. Please try again.');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      const updatedSchedule = meetingSchedule.filter(meeting => 
        (meeting.id || meeting.id === 0) !== meetingId
      );
      
      // Update the trip with the new meeting schedule
      await api.patch(`/api/trips/${tripId}/`, {
        meeting_schedule: JSON.stringify(updatedSchedule)
      });
      
      // Update local state
      setMeetingSchedule(updatedSchedule);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting. Please try again.');
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

          {/* Business Meeting Button - Only show for business travelers */}
          {(isBusinessTraveler || trip.traveler_type === 'business') && (
            <Grid item xs={12} md={6} container justifyContent="flex-end" alignItems="center">
              <Button
                variant="outlined"
                startIcon={<BusinessIcon />}
                onClick={() => navigate(`/trips/${tripId}/meetings`)}
                sx={{ mt: 1 }}
              >
                View Meetings
              </Button>
            </Grid>
          )}

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
              {weather && weather.forecast && Array.isArray(weather.forecast) ? (
                <List>
                  {weather.forecast.map((day, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={new Date(day.date).toLocaleDateString()}
                        secondary={`${day.temperature !== undefined ? day.temperature : 'N/A'}°C - ${day.conditions || 'Unknown'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No weather forecast available</Typography>
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
                {packingList && Array.isArray(packingList) && packingList.length > 0 ? (
                  packingList.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.name}
                        secondary={item.weather_conditions && Array.isArray(item.weather_conditions) ? item.weather_conditions.join(', ') : ''}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No packing items available" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Meeting Schedule Card - Only for Business Travelers */}
        {(isBusinessTraveler || trip.traveler_type === 'business') && (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box display="flex" alignItems="center">
                    <BusinessIcon sx={{ mr: 1.5, color: '#1976d2' }} />
                    <Typography variant="h6">Meeting Schedule</Typography>
                  </Box>
                </Box>
                
                <MeetingsList 
                  meetings={meetingSchedule} 
                  onAddMeeting={() => setOpenMeetingDialog(true)}
                  onDeleteMeeting={handleDeleteMeeting}
                  emptyMessage="No meetings scheduled for this trip"
                />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Activities */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '12px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <DirectionsRunIcon sx={{ mr: 1.5, color: '#1976d2' }} />
                  <Typography variant="h6">Activities</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenActivityDialog(true)}
                  sx={{ borderRadius: '8px' }}
                >
                  Add Activity
                </Button>
              </Box>
              {trip.activities && Array.isArray(trip.activities) && trip.activities.length > 0 ? (
                <List sx={{ 
                  p: 0,
                  overflow: 'hidden'
                }}>
                  {trip.activities.map((activity, index) => (
                    <ListItem 
                      key={index} 
                      divider={index < trip.activities.length - 1}
                      sx={{ 
                        py: 2,
                        borderBottom: index < trip.activities.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="600" color="#1976d2">
                            {activity.name || 'Untitled Activity'}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <EventIcon fontSize="small" sx={{ mr: 1, opacity: 0.7, fontSize: '1rem' }} />
                              <Typography component="span" variant="body2" color="text.secondary">
                                {activity.date || 'No date'}
                              </Typography>
                            </Box>
                            
                            {activity.location && (
                              <Box display="flex" alignItems="center" mb={0.5}>
                                <LocationOn fontSize="small" sx={{ mr: 1, opacity: 0.7, fontSize: '1rem' }} />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {activity.location}
                                </Typography>
                              </Box>
                            )}
                            
                            {activity.description && (
                              <Typography 
                                component="p" 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  mt: 1,
                                  px: 2,
                                  py: 1,
                                  borderLeft: '2px solid rgba(25, 118, 210, 0.3)',
                                  bgcolor: 'rgba(25, 118, 210, 0.03)',
                                  borderRadius: '0 4px 4px 0'
                                }}
                              >
                                {activity.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{
                    py: 4,
                    textAlign: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No activities planned yet
                  </Typography>
            <Button 
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenActivityDialog(true)}
                    sx={{ mt: 2, borderRadius: '8px' }}
                  >
                    Add Your First Activity
            </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Cultural Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cultural Insights</Typography>
              <List>
                {culturalInsights && Array.isArray(culturalInsights) && culturalInsights.length > 0 ? (
                  culturalInsights.map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.description}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No cultural insights available for this destination" />
                  </ListItem>
                )}
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
                {travelTips && Array.isArray(travelTips) && travelTips.length > 0 ? (
                  travelTips.map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={tip.title}
                        secondary={tip.description}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No travel tips available for this destination" />
                  </ListItem>
                )}
              </List>
            </CardContent>
        </Card>
        </Grid>
      </Grid>

      {/* Meetings Dialog */}
      <Dialog 
        open={openMeetingsDialog} 
        onClose={() => setOpenMeetingsDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <BusinessIcon sx={{ mr: 1.5, color: '#1976d2' }} />
              <Typography variant="h6">Meeting Schedule</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <MeetingsList 
            meetings={meetingSchedule} 
            onAddMeeting={() => {
              setOpenMeetingsDialog(false);
              setOpenMeetingDialog(true);
            }}
            onDeleteMeeting={handleDeleteMeeting}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button 
            onClick={() => setOpenMeetingsDialog(false)} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog 
        open={openActivityDialog} 
        onClose={() => setOpenActivityDialog(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <PlaylistAddIcon sx={{ mr: 1.5, color: '#1976d2' }} />
            <Typography variant="h6">Add New Activity</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Activity Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                required
                placeholder="e.g., Sightseeing, Beach Visit"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Location"
                type="text"
                fullWidth
                variant="outlined"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                placeholder="e.g., Downtown, Museum, Park"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Details about this activity"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button 
            onClick={() => setOpenActivityDialog(false)}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddActivity} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '8px' }}
          >
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Meeting Dialog */}
      <Dialog 
        open={openMeetingDialog} 
        onClose={() => setOpenMeetingDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <AddIcon sx={{ mr: 1.5, color: '#1976d2' }} />
            <Typography variant="h6">Add New Meeting</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Meeting Title"
                type="text"
                fullWidth
                variant="outlined"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                required
                placeholder="e.g., Client Meeting, Team Sync"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                fullWidth
                variant="outlined"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Location"
                type="text"
                fullWidth
                variant="outlined"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                placeholder="e.g., Office, Conference Room B, Zoom"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notes"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                placeholder="Any important details about this meeting"
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button 
            onClick={() => setOpenMeetingDialog(false)} 
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMeeting} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '8px' }}
          >
            Add Meeting
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
  );
};

export default TripDetails;

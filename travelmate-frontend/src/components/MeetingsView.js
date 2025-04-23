import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../services/api';
import MeetingsList from './MeetingsList';

const MeetingsView = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [meetingSchedule, setMeetingSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const tripResponse = await api.get(`/api/trips/${tripId}/`);
      setTrip(tripResponse.data);
      
      // Parse meeting schedule
      if (tripResponse.data.meeting_schedule) {
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
    <>
      <AppBar position="static" color="primary" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/trips')}
            color="inherit"
          >
            Back to Trip Dashboard
          </Button>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            Meetings for {trip.destination}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenMeetingDialog(true)}
          >
            Add Meeting
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
          <Box display="flex" alignItems="center" mb={3}>
            <BusinessIcon sx={{ mr: 1.5, color: '#1976d2', fontSize: 30 }} />
            <Typography variant="h5">
              Meeting Schedule
            </Typography>
          </Box>
          
          {meetingSchedule.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No meetings have been scheduled yet for this trip. Add your first meeting!
            </Alert>
          )}
          
          <MeetingsList 
            meetings={meetingSchedule} 
            onAddMeeting={() => setOpenMeetingDialog(true)}
            onDeleteMeeting={handleDeleteMeeting}
            emptyMessage="No meetings scheduled for this trip"
          />
        </Paper>
      </Container>

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
    </>
  );
};

export default MeetingsView; 
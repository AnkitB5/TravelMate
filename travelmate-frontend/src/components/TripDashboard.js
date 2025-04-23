// src/components/TripDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Chip,
  FormHelperText,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import api from '../services/api';
import CitySearch from './CitySearch';
import TripCard from './TripCard';

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    padding: 0;
    overflow: visible;
    background: rgba(20, 20, 30, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(90deg, rgba(30,30,60,0.8) 0%, rgba(60,60,90,0.8) 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 4, 3),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  }
}));

export default function TripDashboard({ searchQuery: propSearchQuery }) {
  const navigate = useNavigate();

  // trips + UI state
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // dialog form state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({ travel_start: '', travel_end: '' });
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableActivities = [
    { id: 1, name: 'Hiking' },
    { id: 2, name: 'Beach' },
    { id: 3, name: 'Sightseeing' },
    { id: 4, name: 'Dining' },
    { id: 5, name: 'Shopping' },
    { id: 6, name: 'Business' },
  ];

  // ** Local searchQuery state, initialized from prop **
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');

  // ** Sync local searchQuery whenever the prop changes **
  useEffect(() => {
    if (propSearchQuery !== undefined) {
      setSearchQuery(propSearchQuery);
    }
  }, [propSearchQuery]);

  // Fetch trips & dedupe
  useEffect(() => { fetchTrips(); }, []);
  async function fetchTrips() {
    setLoading(true);
    try {
      const res = await api.get('/api/trips/');
      const seen = new Set();
      const deduped = res.data.filter(trip => {
        const key = `${trip.destination}|${trip.travel_start}|${trip.travel_end}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setTrips(deduped);
      setFilteredTrips(deduped);
    } catch {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  }

  // Apply search filter when either `trips` or `searchQuery` changes
  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      setFilteredTrips(
        trips.filter(t =>
          t.destination.toLowerCase().includes(q) ||
          (t.travel_start && t.travel_start.toLowerCase().includes(q)) ||
          (t.travel_end && t.travel_end.toLowerCase().includes(q))
        )
      );
    } else {
      setFilteredTrips(trips);
    }
  }, [searchQuery, trips]);

  // --- Dialog open/close & form handlers ---
  function handleOpenDialog(trip = null) {
    setError(null);
    if (trip) {
      setSelectedTrip(trip);
      setSelectedCity({ display_name: trip.destination });
      setFormData({ travel_start: trip.travel_start, travel_end: trip.travel_end });
      const acts = Array.isArray(trip.activities)
        ? trip.activities.map(id => availableActivities.find(a => a.id === id)).filter(Boolean)
        : [];
      setSelectedActivities(acts);
    } else {
      setSelectedTrip(null);
      setSelectedCity(null);
      setFormData({ travel_start: '', travel_end: '' });
      setSelectedActivities([]);
    }
    setOpenDialog(true);
  }
  function handleCloseDialog() {
    setOpenDialog(false);
    setError(null);
  }

  function handleActivitySelect(e) {
    const id = e.target.value;
    const act = availableActivities.find(a => a.id === id);
    if (act && !selectedActivities.some(a => a.id === id)) {
      setSelectedActivities(prev => [...prev, act]);
    }
  }
  function handleActivityRemove(id) {
    setSelectedActivities(prev => prev.filter(a => a.id !== id));
  }

  // Submit create or edit
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedCity) return setError('Please select a destination.');
    if (!formData.travel_start || !formData.travel_end) return setError('Both start and end dates are required.');

    // prevent duplicates on create
    if (!selectedTrip) {
      const exists = trips.some(t =>
        t.destination === selectedCity.display_name &&
        t.travel_start === formData.travel_start &&
        t.travel_end === formData.travel_end
      );
      if (exists) return setError('You already have a trip to that place on those dates.');
    }

    setIsSubmitting(true);
    try {
      const payload = {
        destination: selectedCity.display_name,
        travel_start: formData.travel_start,
        travel_end: formData.travel_end,
        activities: JSON.stringify(selectedActivities.map(a => a.id))
      };
      if (selectedTrip) {
        await api.put(`/api/trips/${selectedTrip.id}/`, payload);
      } else {
        await api.post('/api/trips/', payload);
      }
      handleCloseDialog();
      fetchTrips();
    } catch {
      setError('Failed to save trip.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Top toolbar with Back to Home + New Trip */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Trips</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Trip
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filteredTrips.length === 0 ? (
        <Typography>No trips found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredTrips.map(t => (
            <Grid item xs={12} sm={6} md={4} key={t.id}>
              <TripCard
                trip={t}
                onTripUpdated={fetchTrips}
                onDelete={fetchTrips}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <StyledDialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <StyledDialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FlightTakeoffIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6">
              {selectedTrip ? 'Edit Trip' : 'Plan New Adventure'}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        
        <StyledDialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle variant="subtitle2">
                <LocationOnIcon />
                Destination
              </SectionTitle>
              <CitySearch
                value={selectedCity}
                onChange={setSelectedCity}
                helperText="Search for a city, region, or country"
              />
            </FormSection>
            
            <Divider sx={{ my: 3, opacity: 0.3 }} />
            
            <FormSection>
              <SectionTitle variant="subtitle2">
                <FlightTakeoffIcon />
                Travel Dates
              </SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={formData.travel_start}
                    onChange={e => setFormData(fd => ({ ...fd, travel_start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={formData.travel_end}
                    onChange={e => setFormData(fd => ({ ...fd, travel_end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>
            
            <Divider sx={{ my: 3, opacity: 0.3 }} />
            
            <FormSection>
              <SectionTitle variant="subtitle2">
                <LocalActivityIcon />
                Planned Activities
              </SectionTitle>
              <FormControl fullWidth>
                <InputLabel>Select Activities</InputLabel>
                <Select 
                  value="" 
                  onChange={handleActivitySelect} 
                  label="Select Activities"
                  sx={{
                    borderRadius: '10px',
                    mb: 1
                  }}
                >
                  <MenuItem value=""><em>Choose an activity</em></MenuItem>
                  {availableActivities.map(a => (
                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select multiple activities for your trip</FormHelperText>
              </FormControl>
              
              {selectedActivities.length > 0 && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    background: 'rgba(30, 30, 50, 0.4)',
                    borderRadius: '10px',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {selectedActivities.map(a => (
                    <Chip
                      key={a.id}
                      label={a.name}
                      onDelete={() => handleActivityRemove(a.id)}
                      sx={{
                        borderRadius: '8px',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            color: 'white'
                          }
                        }
                      }}
                    />
                  ))}
                </Paper>
              )}
            </FormSection>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3, 
                  borderRadius: '10px',
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </StyledDialogContent>
        
        <StyledDialogActions>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              borderRadius: '10px',
              px: 3,
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : <FlightTakeoffIcon />}
            sx={{ 
              borderRadius: '10px',
              px: 3,
              '&.Mui-disabled': {
                backgroundColor: 'rgba(144, 202, 249, 0.4)'
              }
            }}
          >
            {isSubmitting
              ? (selectedTrip ? 'Updating...' : 'Creating...')
              : (selectedTrip ? 'Update Trip' : 'Create Trip')}
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </Container>
  );
}

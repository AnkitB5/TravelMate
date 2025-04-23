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
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import api from '../services/api';
import CitySearch from './CitySearch';
import TripCard from './TripCard';

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    padding: 24px;
  }
`;

export default function TripDashboard({ searchQuery: propSearchQuery }) {
  const navigate = useNavigate();

  // --- state ---
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // form inputs
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({ travel_start: '', travel_end: '' });
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [availableActivities] = useState([
    { id: 1, name: 'Hiking' },
    { id: 2, name: 'Beach' },
    { id: 3, name: 'Sightseeing' },
    { id: 4, name: 'Dining' },
    { id: 5, name: 'Shopping' },
    { id: 6, name: 'Business' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');

  // --- load trips + dedupe ---
  useEffect(() => { fetchTrips() }, []);
  async function fetchTrips() {
    setLoading(true);
    try {
      const res = await api.get('/api/trips/');
      // keep only first occurrence of same destination+dates
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

  // --- apply search filter ---
  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      setFilteredTrips(
        trips.filter(t =>
          t.destination.toLowerCase().includes(q) ||
          t.travel_start.includes(q) ||
          t.travel_end.includes(q)
        )
      );
    } else {
      setFilteredTrips(trips);
    }
  }, [searchQuery, trips]);

  // --- open / close dialog ---
  function handleOpenDialog(trip = null) {
    setError(null);
    if (trip) {
      setSelectedTrip(trip);
      setSelectedCity({ display_name: trip.destination });
      setFormData({ travel_start: trip.travel_start, travel_end: trip.travel_end });
      // prefill activities if stored as JSON array
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

  // --- activities pick/remove ---
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

  // --- submit new / edit ---
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedCity) {
      setError('Please select a destination.');
      return;
    }
    if (!formData.travel_start || !formData.travel_end) {
      setError('Both start and end dates are required.');
      return;
    }

    // on create, block exact duplicates
    if (!selectedTrip) {
      const exists = trips.some(t =>
        t.destination === selectedCity.display_name &&
        t.travel_start === formData.travel_start &&
        t.travel_end === formData.travel_end
      );
      if (exists) {
        setError('You already have a trip to that place on those dates.');
        return;
      }
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
        <DialogTitle>{selectedTrip ? 'Edit Trip' : 'Add New Trip'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <CitySearch
              value={selectedCity}
              onChange={setSelectedCity}
              helperText="Select a destination"
            />

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              margin="normal"
              value={formData.travel_start}
              onChange={e => setFormData(fd => ({ ...fd, travel_start: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="End Date"
              type="date"
              margin="normal"
              value={formData.travel_end}
              onChange={e => setFormData(fd => ({ ...fd, travel_end: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Activities</InputLabel>
              <Select value="" onChange={handleActivitySelect} label="Activities">
                <MenuItem value=""><em>None</em></MenuItem>
                {availableActivities.map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select one at a time</FormHelperText>
            </FormControl>

            {selectedActivities.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedActivities.map(a => (
                  <Chip
                    key={a.id}
                    label={a.name}
                    onDelete={() => handleActivityRemove(a.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (selectedTrip ? 'Updating…' : 'Creating…')
              : (selectedTrip ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
}

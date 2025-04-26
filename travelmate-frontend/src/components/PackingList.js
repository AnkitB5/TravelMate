// src/components/PackingList.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
  CircularProgress,
  Button,
  Container,
  Alert,
  TextField,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import api from '../services/api';

const PackingList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [tripId, setTripId] = useState(null);
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [packingList, setPackingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  
  // === NEW: cultural dress code insights ===
  const [dressCodes, setDressCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  useEffect(() => {
    // Check if state is available from navigation
    if (state && state.tripId) {
      console.log('Retrieved trip data from navigation state:', state);
      setTripId(state.tripId);
      setTrip(state.trip);
      setActivities(state.activities || []);
    } else {
      // Try to extract trip ID from URL if state is not available
      const pathSegments = window.location.pathname.split('/');
      const possibleTripId = pathSegments[pathSegments.indexOf('trips') + 1];
      if (possibleTripId && !isNaN(parseInt(possibleTripId))) {
        const extractedTripId = parseInt(possibleTripId);
        console.log('Extracted trip ID from URL:', extractedTripId);
        setTripId(extractedTripId);
        
        // Fetch trip details since we don't have them
        api.get(`/api/trips/${extractedTripId}/`)
          .then(res => {
            console.log('Fetched trip details:', res.data);
            setTrip(res.data);
            // Extract activities
            try {
              const tripActivities = typeof res.data.activities === 'string' 
                ? JSON.parse(res.data.activities) 
                : res.data.activities || [];
              setActivities(tripActivities);
            } catch (e) {
              console.error('Error parsing activities:', e);
              setActivities([]);
            }
          })
          .catch(err => {
            console.error('Error fetching trip details:', err);
            setError('Failed to load trip details');
          });
      } else {
        console.error('No trip ID available in state or URL');
        setError('No trip ID available. Please return to the trips page and try again.');
      }
    }
  }, [state]);

  // Fetch packing list
  useEffect(() => {
    if (!tripId) return;
    
    const fetchPacking = async () => {
      try {
        setLoading(true);
        console.log(`Fetching packing list for trip ${tripId} with activities:`, activities);
        
        const res = await api.post(`/api/trips/${tripId}/packing-list/`, {
          activities: activities || []
        });
        
        console.log('Packing list API response:', res.data);
        setApiResponse(res.data);
        
        const items = Array.isArray(res.data) 
          ? res.data 
          : Array.isArray(res.data.items) 
            ? res.data.items 
            : typeof res.data === 'object' ? Object.values(res.data) : [];
            
        console.log('Processed items array:', items);
        
        const normalized = items.map(item => ({
          id: item.id || Math.random().toString(36).substr(2,9),
          name: item.name || 'Unnamed Item',
          category: item.category || 'General',
          description: item.description || ''
        }));
        
        setPackingList(normalized);
        setCheckedItems(normalized.reduce((a,i)=>({...a,[i.id]:false}),{}));
      } catch (err) {
        console.error('Error loading packing list:', err);
        setApiResponse(err.response?.data || err.message);
        setError(`Failed to load packing list: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPacking();
  }, [tripId, activities]);

  // === Fetch dress-code insights ===
  useEffect(() => {
    if (!tripId) return;
    
    const fetchDressCodes = async () => {
      try {
        setLoadingCodes(true);
        console.log(`Fetching cultural insights for trip ${tripId}`);
        const res = await api.get(`/api/trips/${tripId}/cultural-insights/`);
        console.log('Cultural insights response:', res.data);
        // filter to only dress code entries
        const codes = res.data.filter(i => i.category === 'dress_code');
        setDressCodes(codes);
      } catch(err) {
        console.error('Error fetching cultural insights:', err);
        // silently ignore
      } finally {
        setLoadingCodes(false);
      }
    };
    
    fetchDressCodes();
  }, [tripId]);

  // Persist updated packing_list back to trip
  const savePackingList = async (items) => {
    if (!tripId) return;
    
    try {
      console.log('Saving packing list:', items);
      await api.patch(`/api/trips/${tripId}/`, {
        packing_list: JSON.stringify(items)
      });
      console.log('Packing list saved successfully');
    } catch (e) {
      console.error('Error saving packing list:', e);
      setError('Failed to save packing list');
    }
  };

  const handleToggle = id => {
    setCheckedItems(prev => ({...prev, [id]: !prev[id] }));
  };

  const handleAddItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    const newItem = {
      id: Math.random().toString(36).substr(2,9),
      name,
      category: 'Other',
      description: ''
    };
    const updated = [...packingList, newItem];
    setPackingList(updated);
    setCheckedItems(prev => ({...prev,[newItem.id]:false}));
    setNewItemName('');
    savePackingList(updated);
  };

  const handleRemoveItem = id => {
    const updated = packingList.filter(i=>i.id!==id);
    setPackingList(updated);
    const { [id]:_, ...rest } = checkedItems;
    setCheckedItems(rest);
    savePackingList(updated);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  if (loading) return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress/>
      </Box>
    </Container>
  );

  if (!tripId) {
    return (
      <Container>
        <Alert severity="error" sx={{mt: 4}}>
          {error || 'No trip selected. Please return to trips page.'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/dashboard')}
          sx={{mt: 2}}
        >
          Back to Trips
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='rgba(144,202,249,255)'>
          Packing List for {trip?.destination || `Trip #${tripId}`}
        </Typography>
        <Box>
          <Button 
            startIcon={<BugReportIcon />} 
            onClick={toggleDebugMode}
            sx={{mr: 1}}
            color="secondary"
            variant={debugMode ? "contained" : "outlined"}
          >
            Debug
          </Button>
          <Button startIcon={<ArrowBackIcon />} onClick={()=>navigate(-1)}>
            Back
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
      
      {/* Debug Information */}
      {debugMode && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.7)' }}>
          <Typography variant="h6" color="secondary">Debug Information</Typography>
          <Typography variant="body2" gutterBottom>Trip ID: {tripId}</Typography>
          <Typography variant="body2" gutterBottom>Activities: {JSON.stringify(activities)}</Typography>
          <Typography variant="body2" gutterBottom>Items Count: {packingList.length}</Typography>
          
          <Typography variant="subtitle1" mt={2}>API Response:</Typography>
          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}

      {/* Dress Code Recommendations */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
          Cultural Dress Code Recommendations
        </Typography>
        {loadingCodes
          ? <CircularProgress size={24} />
          : dressCodes.length === 0
            ? <Typography color="textSecondary" style={{ color: 'white' }}>No dress‑code info available.</Typography>
            : dressCodes.map(code => (
                <Box
                  key={code.id}
                  mb={2}
                  p={2}
                  style={{
                    backgroundColor: 'black',
                    borderRadius: '8px',
                    border: '1px solid white'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" style={{ color: 'white' }}>
                    {code.title}
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white' }}>
                    {code.description}
                  </Typography>
                </Box>
              ))
        }
      </Box>

      {/* Add new item */}
      <Box mb={3} display="flex" gap={2}>
        <TextField
          fullWidth
          size="small"
          label="Add custom item"
          value={newItemName}
          onChange={e=>setNewItemName(e.target.value)}
        />
        <Button variant="contained" startIcon={<AddIcon/>} onClick={handleAddItem}>
          Add
        </Button>
      </Box>

      {packingList.length === 0
        ? <Alert severity="info">Your packing list is empty.</Alert>
        : (
          <Paper elevation={3}>
            <List>
              {packingList.map(item=>(
                <ListItem key={item.id} divider secondaryAction={
                  <IconButton edge="end" onClick={()=>handleRemoveItem(item.id)}>
                    <DeleteIcon/>
                  </IconButton>
                }>
                  <Checkbox
                    edge="start"
                    checked={checkedItems[item.id]||false}
                    onChange={()=>handleToggle(item.id)}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={item.description}
                    sx={{
                      textDecoration: checkedItems[item.id]
                        ? 'line-through'
                        : 'none'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )
      }
    </Container>
  );
};

export default PackingList;

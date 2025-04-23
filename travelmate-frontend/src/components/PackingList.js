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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import api from '../services/api';

const PackingList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tripId, trip, activities } = state || {};

  const [packingList, setPackingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // === NEW: cultural dress code insights ===
  const [dressCodes, setDressCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  // Fetch packing list
  useEffect(() => {
    const fetchPacking = async () => {
      try {
        setLoading(true);
        const res = await api.post(`/api/trips/${tripId}/packing-list/`, {
          activities: activities || []
        });
        const items = Array.isArray(res.data) 
          ? res.data 
          : Array.isArray(res.data.items) 
            ? res.data.items 
            : Object.values(res.data);
        const normalized = items.map(item => ({
          id: item.id || Math.random().toString(36).substr(2,9),
          name: item.name || 'Unnamed Item',
          category: item.category || 'General',
          description: item.description || ''
        }));
        setPackingList(normalized);
        setCheckedItems(normalized.reduce((a,i)=>({...a,[i.id]:false}),{}));
      } catch (err) {
        setError('Failed to load packing list');
      } finally {
        setLoading(false);
      }
    };
    fetchPacking();
  }, [tripId, activities]);

  // === Fetch dress-code insights ===
  useEffect(() => {
    const fetchDressCodes = async () => {
      try {
        setLoadingCodes(true);
        const res = await api.get(`/api/trips/${tripId}/cultural-insights/`);
        // filter to only dress code entries
        const codes = res.data.filter(i => i.category === 'dress_code');
        setDressCodes(codes);
      } catch(_) {
        // silently ignore
      } finally {
        setLoadingCodes(false);
      }
    };
    fetchDressCodes();
  }, [tripId]);

  // Persist updated packing_list back to trip
  const savePackingList = async (items) => {
    try {
      await api.patch(`/api/trips/${tripId}/`, {
        packing_list: JSON.stringify(items)
      });
    } catch (e) {
      console.error(e);
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

  if (loading) return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress/>
      </Box>
    </Container>
  );

  return (
    <Container>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='rgba(144,202,249,255)'>
          Packing List for {trip?.destination || 'Your Trip'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={()=>navigate(-1)}>
          Back
        </Button>
      </Box>

      {/* NEW: Dress Code Recommendations */}
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

      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}

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

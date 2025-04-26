import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Box,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

const TravelTips = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`Fetching travel tips for trip ID: ${tripId}`);
    api.get(`/api/trips/${tripId}/travel-tips/`)
      .then(res => {
        console.log('Travel tips API response:', res.data);
        setTips(res.data);
      })
      .catch(err => {
        console.error('Error fetching travel tips:', err);
        setError(`Failed to load travel tips: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    </Container>
  );

  return (
    <Container sx={{ mt:4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Typography variant="h4" gutterBottom color="primary">
        Travel Tips for Trip #{tripId}
      </Typography>

      {error && <Alert severity="error" sx={{mb:3}}>{error}</Alert>}

      {tips.length === 0 ? (
        <Alert severity="info" sx={{mb:2}}>No travel tips available for this trip.</Alert>
      ) : (
        <Paper elevation={3} sx={{ bgcolor: 'rgba(0,0,0,0.7)' }}>
        <List>
          {tips.map((tip, idx) => (
            <ListItem key={tip.id || idx} divider>
              <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {tip.title || tip.category || 'Untitled Tip'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      {tip.description || 'No description available'}
                    </Typography>
                  }
              />
            </ListItem>
          ))}
        </List>
        </Paper>
      )}
    </Container>
  );
};

export default TravelTips;
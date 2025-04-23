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
  Button
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
    api.get(`/api/trips/${tripId}/travel-tips/`)
      .then(res => setTips(res.data))
      .catch(() => setError('Failed to load travel tips.'))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <Container><CircularProgress /></Container>;
  if (error)   return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt:4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Travel Tips
      </Typography>

      {tips.length === 0 ? (
        <Typography>No travel tips available for this trip.</Typography>
      ) : (
        <List>
          {tips.map((tip, idx) => (
            <ListItem key={tip.id || idx} divider>
              <ListItemText
                primary={tip.title || tip.category}
                secondary={tip.description}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TravelTips;
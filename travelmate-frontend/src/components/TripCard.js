// src/components/TripCard.js
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TripCard = ({ trip, onEdit, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: '1rem', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {trip.destination}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {trip.travel_start} to {trip.travel_end}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Activities:</strong> {trip.activities || 'None'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(trip)}>
          Edit
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(trip.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;

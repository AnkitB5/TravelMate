// src/components/TripCard.js
import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useNavigate } from 'react-router-dom';
import EditTripForm from './EditTripForm';
import api from '../services/api';

const TripCard = ({ trip, onDelete, onTripUpdated }) => {
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleEdit = () => {
    setEditDialogOpen(true);
  };
  
  const handleEditClose = () => {
    setEditDialogOpen(false);
  };
  
  const handleSave = (updatedTrip) => {
    // Call the callback to update the trip list
    if (onTripUpdated) {
      onTripUpdated(updatedTrip);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      api.delete(`/api/trips/${trip.id}/`)
        .then(() => {
          if (onDelete) {
            onDelete(trip.id);
          }
        })
        .catch(err => console.error('Error deleting trip:', err));
    }
  };

  return (
    <>
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
          <Button size="small" startIcon={<WbSunnyIcon />} onClick={() => navigate(`/weather/${trip.id}`)}>
            Weather
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>
      
      <EditTripForm 
        open={editDialogOpen}
        onClose={handleEditClose}
        trip={trip}
        onSave={handleSave}
      />
    </>
  );
};

export default TripCard;

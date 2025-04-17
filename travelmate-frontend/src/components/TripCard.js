// src/components/TripCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Button,
  Typography,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditTripForm from './EditTripForm';
import api from '../services/api';

const UNSPLASH_ACCESS_KEY = 'rBjgQnvzMAXOKL6EFmP1ZnV_TmbdIeqxJ4ZtowVZVGY'; // Replace with your Unsplash Access Key

const TripCard = ({ trip, onTripUpdated, onDelete }) => {
  const navigate = useNavigate();
  
  // Destructure trip properties (with fallbacks)
  const {
    id,
    destination,
    travel_start,
    travel_end,
    imageUrl,
    description,
  } = trip;
  
  const startDate = new Date(travel_start);
  const endDate = new Date(travel_end);
  
  // Calculate duration in days
  const tripDuration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // State to hold a dynamic image URL fetched from Unsplash if imageUrl is not provided
  const [dynamicImage, setDynamicImage] = useState('');
  
  useEffect(() => {
    if (!imageUrl && destination) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              destination
            )}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setDynamicImage(data.results[0].urls.small);
          }
        } catch (err) {
          console.error('Error fetching Unsplash image:', err);
        }
      };
      fetchImage();
    }
  }, [destination, imageUrl]);
  
  // Decide which image URL to use
  const displayImageUrl = imageUrl || dynamicImage || 
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80";
  
  // Fallback text for description
  const displayDescription = description ||
    "Explore this destination and discover its unique attractions.";
  
  // State for controlling the options menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // State for editing modal
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };
  const handleEditClose = () => {
    setEditDialogOpen(false);
  };
  const handleSave = (updatedTrip) => {
    if (onTripUpdated) {
      onTripUpdated(updatedTrip);
    }
    setEditDialogOpen(false);
  };
  const handleDelete = () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this trip?")) {
      api
        .delete(`/api/trips/${id}/`)
        .then(() => {
          if (onDelete) {
            onDelete(id);
          }
        })
        .catch((err) => console.error("Error deleting trip:", err));
    }
  };
  // Navigate to details (for example, weather page)
  const handleView = () => {
    navigate(`/weather/${id}`);
  };

  return (
    <>
      <Card
        sx={{
          width: 350,
          height: 400, // Increased card height
          overflow: 'hidden',
          boxShadow: 3,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image Section */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}> {/* Increased image container height */}
          <img
            src={displayImageUrl}
            alt={destination}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <IconButton
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }}
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1 }} /> Edit Trip
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete Trip
            </MenuItem>
          </Menu>
        </div>

        {/* Header Section */}
        <CardHeader
          sx={{ padding: 2, paddingBottom: 0 }}
          title={
            <Typography variant="h6" noWrap>
              {destination}
            </Typography>
          }
          subheader={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarTodayIcon fontSize="small" />
              <Typography variant="body2">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </Typography>
              <Chip label={`${tripDuration} ${tripDuration === 1 ? 'day' : 'days'}`} size="small" />
            </div>
          }
        />

        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, padding: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {displayDescription}
          </Typography>
        </CardContent>

        {/* Footer Section */}
        <CardActions sx={{ padding: 2 }}>
          <Button variant="outlined" fullWidth onClick={handleView}>
            View Details
          </Button>
        </CardActions>
      </Card>

      {/* EditTripForm modal */}
      <EditTripForm open={editDialogOpen} onClose={handleEditClose} trip={trip} onSave={handleSave} />
    </>
  );
};

export default TripCard;

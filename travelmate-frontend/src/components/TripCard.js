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
import BusinessIcon from '@mui/icons-material/Business';
import EditTripForm from './EditTripForm';
import api from '../services/api';

const UNSPLASH_ACCESS_KEY = 'rBjgQnvzMAXOKL6EFmP1ZnV_TmbdIeqxJ4ZtowVZVGY';

const TripCard = ({ trip, onTripUpdated, onDelete }) => {
  const navigate = useNavigate();
  const { id, destination, travel_start, travel_end, imageUrl, description, traveler_type } = trip;
  const startDate = new Date(travel_start);
  const endDate = new Date(travel_end);
  const tripDuration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const [dynamicImage, setDynamicImage] = useState('');
  const [isBusinessTraveler, setIsBusinessTraveler] = useState(false);
  const [hasMeetings, setHasMeetings] = useState(false);

  useEffect(() => {
    // Check if user is a business traveler
    const userTravelerType = localStorage.getItem('traveler_type');
    console.log('TripCard - User traveler type:', userTravelerType);
    console.log('TripCard - Trip traveler type:', traveler_type);
    setIsBusinessTraveler(userTravelerType === 'business' || traveler_type === 'business');
    
    // Check if trip has meetings
    if (trip.meeting_schedule) {
      try {
        const meetingData = typeof trip.meeting_schedule === 'string' 
          ? JSON.parse(trip.meeting_schedule) 
          : trip.meeting_schedule;
        setHasMeetings(Array.isArray(meetingData) && meetingData.length > 0);
      } catch (err) {
        console.error('Error parsing meeting schedule:', err);
        setHasMeetings(false);
      }
    }
  }, [trip, traveler_type]);
  
  useEffect(() => {
    if (!imageUrl && destination) {
      (async () => {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              destination
            )}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
          );
          const data = await res.json();
          if (data.results?.length) setDynamicImage(data.results[0].urls.small);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [destination, imageUrl]);
  
  const displayImage = imageUrl || dynamicImage ||
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80';
  const desc = description || 'Explore this destination and discover its unique attractions.';
  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = e => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const [editOpen, setEditOpen] = useState(false);
  const onEdit = () => { setEditOpen(true); closeMenu(); };
  const onEditClose = () => setEditOpen(false);
  const onSave = updated => { onTripUpdated?.(updated); onEditClose(); };
  const onDeleteClick = () => {
    closeMenu();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      api.delete(`/api/trips/${id}/`).then(() => onDelete?.(id));
    }
  };

  return (
    <>
      <Card sx={{ width:350, height:400, display:'flex', flexDirection:'column', boxShadow:3, '&:hover':{boxShadow:6} }}>
        <div style={{ position:'relative', height:200, overflow:'hidden' }}>
          <img src={displayImage} alt={destination} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <IconButton onClick={openMenu} sx={{ position:'absolute', top:8, right:8, bgcolor:'rgba(255,255,255,0.8)' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
            <MenuItem onClick={onEdit}><EditIcon sx={{mr:1}}/>Edit Trip</MenuItem>
            <MenuItem onClick={onDeleteClick} sx={{ color:'red' }}><DeleteIcon sx={{mr:1}}/>Delete Trip</MenuItem>
          </Menu>
        </div>

        <CardHeader
          sx={{ pt:1, pb:0, px:2 }}
          title={<Typography variant="h6" noWrap>{destination}</Typography>}
          subheader={
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <CalendarTodayIcon fontSize="small"/>
              <Typography variant="body2">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</Typography>
              <Chip label={`${tripDuration} ${tripDuration===1?'day':'days'}`} size="small" />
            </div>
          }
        />

        <CardContent sx={{ flexGrow:1, px:2 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {desc}
          </Typography>
        </CardContent>

        <CardActions sx={{ flexDirection:'column', gap:1, p:2 }}>
          <Button variant="outlined" fullWidth onClick={()=>navigate(`/trips/${id}/weather`)}>
            View Details
          </Button>

          {/* Business Meeting Button - Only show for business travelers */}
          {isBusinessTraveler && (
            <Button
              variant="outlined"
              fullWidth
              color="primary"
              startIcon={<BusinessIcon />}
              onClick={() => navigate(`/trips/${id}/meetings`)}
            >
              View Meetings
            </Button>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              let activityIds = [];
              try {
                if (trip.activities) {
                  activityIds = typeof trip.activities === 'string' ? JSON.parse(trip.activities) : trip.activities;
                }
              } catch {};

              const available = [
                {id:1,name:'Hiking'}, {id:2,name:'Beach'}, {id:3,name:'Sightseeing'},
                {id:4,name:'Business'}, {id:5,name:'Shopping'}, {id:6,name:'Dining'}
              ];
              const activityNames = activityIds.map(i=> available.find(a=>a.id===i)?.name || `Activity ${i}`);

              navigate(`/trips/${id}/packing-list`, { state:{ tripId:id, trip, activities:activityNames } });
            }}
            sx={{ bgcolor:'#4caf50','&:hover':{bgcolor:'#388e3c'} }}
          >
            View Packing List
          </Button>

          {/* Travel Tips button */}
          <Button
            variant="outlined"
            fullWidth
            color="secondary"
            onClick={() => navigate(`/trips/${id}/travel-tips`)}
          >
            View Travel Tips
          </Button>
        </CardActions>
      </Card>

      <EditTripForm open={editOpen} onClose={onEditClose} trip={trip} onSave={onSave} />
    </>
  );
};

export default TripCard;
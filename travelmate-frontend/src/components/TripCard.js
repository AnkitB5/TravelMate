// src/components/TripCard.js
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const TripCard = ({ trip }) => {
  const [open, setOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: '1rem', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {trip.destination}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.travel_start} to {trip.travel_end}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '0.5rem' }}>
            <strong>Activities:</strong> {trip.activities ? trip.activities : 'None'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" startIcon={<InfoIcon />} onClick={handleDialogOpen}>
            Details
          </Button>
        </CardActions>
      </Card>

      {/* Dialog for displaying more trip details */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Trip Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1"><strong>Destination:</strong> {trip.destination}</Typography>
          <Typography variant="subtitle1"><strong>Dates:</strong> {trip.travel_start} - {trip.travel_end}</Typography>
          <Typography variant="body1" sx={{ marginTop: '0.5rem' }}>
            <strong>Activities:</strong> {trip.activities ? trip.activities : 'None'}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
            <strong>Packing List:</strong> {trip.packing_list && trip.packing_list.length > 0 ? trip.packing_list.join(', ') : 'No items suggested yet.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TripCard;

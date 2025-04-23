import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  IconButton,
  Divider,
  Grid,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  Add as AddIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const MeetingsList = ({ 
  meetings = [], 
  onAddMeeting, 
  onDeleteMeeting, 
  emptyMessage = "No meetings scheduled yet" 
}) => {
  // Format date if possible
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (!meetings || meetings.length === 0) {
    return (
      <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '12px', mt: 2 }}>
        <CardContent>
          <Box 
            sx={{
              py: 4,
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              border: '1px dashed rgba(0, 0, 0, 0.1)'
            }}
          >
            <BusinessIcon sx={{ fontSize: 40, color: 'rgba(0, 0, 0, 0.2)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {emptyMessage}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddMeeting}
              sx={{ mt: 2, borderRadius: '8px' }}
            >
              Add Your First Meeting
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid rgba(0, 0, 0, 0.08)', 
        borderRadius: '12px',
        overflow: 'hidden',
        mt: 2
      }}
    >
      {/* Table Header */}
      <Box 
        sx={{ 
          bgcolor: 'rgba(25, 118, 210, 0.05)',
          p: 2, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex'
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Typography variant="subtitle2" fontWeight="bold">
              Meeting
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" fontWeight="bold">
              Date & Time
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Location
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Actions
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Meeting Rows */}
      <List sx={{ p: 0 }}>
        {meetings.map((meeting, index) => (
          <React.Fragment key={meeting.id || index}>
            <ListItem 
              sx={{ 
                p: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' }
              }}
            >
              <Grid container alignItems="center">
                {/* Title */}
                <Grid item xs={3}>
                  <Typography variant="subtitle1" color="primary" fontWeight={500}>
                    {meeting.title || 'Untitled Meeting'}
                  </Typography>
                </Grid>
                
                {/* Date & Time */}
                <Grid item xs={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon 
                      sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} 
                    />
                    <Typography variant="body2">
                      {formatDate(meeting.date)}
                    </Typography>
                    
                    {meeting.time && (
                      <>
                        <TimeIcon 
                          sx={{ fontSize: 16, ml: 1, mr: 0.5, color: 'text.secondary' }} 
                        />
                        <Typography variant="body2">
                          {meeting.time}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>
                
                {/* Location */}
                <Grid item xs={4}>
                  {meeting.location ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon 
                        sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} 
                      />
                      <Typography variant="body2" noWrap>
                        {meeting.location}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No location specified
                    </Typography>
                  )}
                </Grid>
                
                {/* Actions */}
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => onDeleteMeeting(meeting.id || index)}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' } 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
            
            {/* Notes Section (if any) */}
            {meeting.notes && (
              <Box 
                sx={{ 
                  px: 2, 
                  pb: 2,
                  pt: 0
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: '4px',
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <NotesIcon 
                    sx={{ 
                      fontSize: 16,
                      mt: 0.3,
                      color: 'text.secondary',
                      opacity: 0.7 
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {meeting.notes}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {index < meetings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      
      {/* Add Meeting Button */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'center' 
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddMeeting}
          sx={{ borderRadius: '8px' }}
        >
          Add New Meeting
        </Button>
      </Box>
    </Paper>
  );
};

export default MeetingsList; 
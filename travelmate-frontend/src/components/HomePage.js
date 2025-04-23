import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import BackpackIcon from '@mui/icons-material/Backpack';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: 'calc(100vh - 0px)', // full viewport minus any sticky nav/footer
        color: 'text.primary',
        px: { xs: 2, md: 8 },
        py: { xs: 6, md: 12 },
      }}
    >
      {/* Top Hero */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Plan Your Dream Trip with AI Assistance
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Discover hidden gems, create personalized itineraries, streamline your travel plans—effortlessly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/about')}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              About Us
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} />
      </Grid>

      {/* Features */}
      <Box sx={{ mt: { xs: 8, md: 16 } }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, mb: 4 }}
        >
          Why Choose TravelMate
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <TravelExploreIcon />, title: 'AI-Powered Itineraries', subtitle: 'Personalized suggestions for every traveler.' },
            { icon: <TimelineIcon />, title: 'Interactive Timeline', subtitle: 'Drag-and-drop to organize your trip.' },
            { icon: <LocationOnIcon />, title: 'Destination Discovery', subtitle: 'Explore new spots and hidden gems.' },
            { icon: <TipsAndUpdatesIcon />, title: 'Smart Recommendations', subtitle: 'Weather-focused & trend-based advice.' },
            { icon: <BackpackIcon />, title: 'Auto Packing Lists', subtitle: 'Instantly generate your packing list.' },
            { icon: <CardGiftcardIcon />, title: 'Exclusive Deals', subtitle: 'Unlock personalized discounts.' },
          ].map(({ icon, title, subtitle }, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} lg={2}>
              <Box
                sx={{
                  textAlign: 'center',
                  px: 2,
                  py: 4,
                  borderRadius: 2,
                  backdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                {React.cloneElement(icon, { sx: { fontSize: 40, color: 'primary.main' } })}
                <Typography variant="h6" sx={{ mt: 1, color: '#FFF' }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#DDD' }}>
                  {subtitle}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;

// src/components/HomePage.js
import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// MUI Icons for placeholders
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import BackpackIcon from '@mui/icons-material/Backpack';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'; // New icon for sixth bullet point

import backgroundGif from '../assets/background.gif'; // Double-check this path

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top Section: Text and Image arranged horizontally with Flex */}
      <Container
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Side (Text Content) */}
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Plan Your Dream Trip with AI Assistance
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Discover hidden gems, create personalized itineraries, and streamline your travel plans effortlessly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary" //#2196f3
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/about')} // To be implemented later
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              About Us
            </Button>
          </Box>
        </Box>

        {/* Right Side (Image) */}
        <Box sx={{ flex: 1, pl: 2 }}>
          <Box
            sx={{
              width: '100%',
              height: '300px',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={backgroundGif}
              alt="Trip planning illustration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Bullet-Point Style Graphics Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
            Why Choose TravelMate
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {/* 1: AI-Powered Itineraries */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TravelExploreIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  AI-Powered Itineraries
                </Typography>
                <Typography variant="body2">
                  Personalized suggestions for every traveler.
                </Typography>
              </Box>
            </Grid>

            {/* 2: Interactive Trip Timeline */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Interactive Timeline
                </Typography>
                <Typography variant="body2">
                  Drag-and-drop features to organize your itinerary.
                </Typography>
              </Box>
            </Grid>

            {/* 3: Destination Discovery */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Destination Discovery
                </Typography>
                <Typography variant="body2">
                  Explore new spots and hidden gems.
                </Typography>
              </Box>
            </Grid>

            {/* 4: Smart Recommendations */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TipsAndUpdatesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Smart Recommendations
                </Typography>
                <Typography variant="body2">
                  Weather-focused and trend-based advice.
                </Typography>
              </Box>
            </Grid>

            {/* 5: Auto-Generated Packing */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <BackpackIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Auto Packing Lists
                </Typography>
                <Typography variant="body2">
                  Instantly generate customized lists.
                </Typography>
              </Box>
            </Grid>

            {/* 6: Exclusive Deals */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CardGiftcardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Exclusive Deals
                </Typography>
                <Typography variant="body2">
                  Unlock personalized discounts and offers.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

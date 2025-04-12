// src/components/HomePage.js
import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundGif from '../assets/background.gif'; // if using a GIF background

const HomePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: `url(${backgroundGif})`, // use your chosen background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for contrast */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
          pt: 10,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          {username ? `Welcome, ${username}` : 'Welcome to TravelMate'}
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Plan Your Adventures in Style
        </Typography>
        <Box sx={{ mt: 4 }}>
          {username ? (
            <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} sx={{ mr: 2, px: 4, py: 1.5, textTransform: 'none' }}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ mr: 2, px: 4, py: 1.5, textTransform: 'none' }}>
                Login
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate('/signup')} sx={{ px: 4, py: 1.5, textTransform: 'none' }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
        <Paper elevation={6} sx={{ mt: 8, p: 4, background: 'rgba(0,0,0,0.5)' }}>
          <Typography variant="h6" gutterBottom>
            Explore TravelMate Features:
          </Typography>
          <Typography variant="body1">
            • Create and manage trips tailored for Casual and Business Travelers<br />
            • Get weather-based and formal clothing recommendations<br />
            • Auto-generated packing lists and essential travel tips
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;

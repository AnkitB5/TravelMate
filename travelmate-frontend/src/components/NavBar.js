// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('traveler_type');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ mb: 2, background: 'rgba(0,0,0,0.75)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TravelMate
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: 'none' }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/dashboard" sx={{ textTransform: 'none' }}>
            Dashboard
          </Button>
          {token ? (
            <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ textTransform: 'none' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup" sx={{ textTransform: 'none' }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

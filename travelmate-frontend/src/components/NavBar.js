// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/travelmate logo/1-removebg-preview.png';

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
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        px: 2,
        py: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo that navigates to Home */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            height: 50,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Travel Mate Logo"
            sx={{
              height: '100%',
              transform: 'scale(3)', // scale up image visually
              transformOrigin: 'left center',
            }}
          />
        </Box>


        {/* Nav Buttons */}
        <Box>
          <Button
            component={Link}
            to="/"
            sx={{
              textTransform: 'none',
              color: '#000',
              fontSize: '16px',
              mx: 1,
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            sx={{
              textTransform: 'none',
              color: '#000',
              fontSize: '16px',
              mx: 1,
            }}
          >
            Dashboard
          </Button>
          {token ? (
            <Button
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                color: '#000',
                fontSize: '16px',
                mx: 1,
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  textTransform: 'none',
                  color: '#000',
                  fontSize: '16px',
                  mx: 1,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                sx={{
                  textTransform: 'none',
                  color: '#000',
                  fontSize: '16px',
                  mx: 1,
                }}
              >
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

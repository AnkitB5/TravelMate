// src/components/Navbar.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  InputBase,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/travelmate logo/1-removebg-preview.png';

// Styled Search container with a white background and light border
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '20ch',
  },
}));

// Styled container for the search icon with black color
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
}));

// Styled input for the search bar ensuring black text and placeholder
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#000',
  fontSize: 16,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // make room for the search icon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    '&::placeholder': {
      color: '#000',
      opacity: 1,
    },
  },
}));

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
        {/* Left side: Logo */}
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
              transform: 'scale(3)',
              transformOrigin: 'left center',
            }}
          />
        </Box>

        {/* Right side: Search Bar and Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* Navigation Buttons */}
          {token ? (
            <>
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
            </>
          ) : (
            <>
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
                to="/about"
                sx={{
                  textTransform: 'none',
                  color: '#000',
                  fontSize: '16px',
                  mx: 1,
                }}
              >
                About Us
              </Button>
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

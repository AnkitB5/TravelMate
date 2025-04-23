// src/components/Navbar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const NavBar = ({ onSearch }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const showSearchBar = location.pathname === '/dashboard' || location.pathname === '/trips';

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          TravelMate
        </Typography>

        {showSearchBar && (
          <Box sx={{ mx: 2 }}>
            <TextField
              size="small"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: 300,
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoggedIn ? (
            <>
              <Button
                component={Link}
                to="/dashboard"
                sx={{ color: 'white' }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('username');
                  localStorage.removeItem('isAuthenticated');
                  navigate('/');
                }}
                sx={{ color: 'white' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/"
                sx={{ color: 'white' }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/about"
                sx={{ color: 'white' }}
              >
                About Us
              </Button>
              <Button
                component={Link}
                to="/login"
                sx={{ color: 'white' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                sx={{ color: 'white' }}
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

export default NavBar;

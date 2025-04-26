import React, { useState, useEffect } from 'react';
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

const NavBar = ({ onSearch, isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Use the prop if provided, otherwise check localStorage directly
  const [authState, setAuthState] = useState(
    isAuthenticated !== undefined 
      ? isAuthenticated 
      : !!localStorage.getItem('access_token')
  );
  
  // Update local state when the prop changes
  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setAuthState(isAuthenticated);
    }
  }, [isAuthenticated]);
  
  const showSearchBar = ['/dashboard','/trips'].includes(location.pathname);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (typeof onSearch === 'function') {
      onSearch(q);
    }
  };

  const handleLogout = () => {
    console.log('User initiated logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('traveler_type');
    
    // Update parent component's auth state if provided
    if (typeof setIsAuthenticated === 'function') {
      setIsAuthenticated(false);
    }
    
    // Update local state
    setAuthState(false);
    
    // Navigate to home page
    navigate('/');
    console.log('Logout complete, redirected to home page');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: '#FFF',
            fontWeight: 'bold',
          }}
        >
          TravelMate
        </Typography>

        {authState && showSearchBar && (
          <Box sx={{ mr: 2, width: { xs: 120, sm: 200, md: 300 } }}>
            <TextField
              size="small"
              placeholder="Search trips…"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#FFF',
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFF' },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
            }}
          />
        </Box>
        )}

        {authState ? (
            <>
            <Button component={Link} to="/dashboard" sx={{ color: '#FFF' }}>
                Dashboard
              </Button>
              <Button
              sx={{ color: '#FFF' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
            <Button component={Link} to="/login" sx={{ color: '#FFF' }}>
                Login
              </Button>
            <Button component={Link} to="/signup" sx={{ color: '#FFF' }}>
                Sign Up
              </Button>
            </>
          )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

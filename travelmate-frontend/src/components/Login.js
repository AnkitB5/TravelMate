// src/components/Login.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Box,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GoogleAuthButton from './GoogleAuthButton';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (token && isAuth === 'true') {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Logging in with:', { username });
      
      const res = await api.post('/token/', { username, password });
      console.log('Login response:', res.data);
      
      if (res.data.access) {
        console.log('Setting tokens in localStorage');
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh || '');
        localStorage.setItem('username', username);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Fetch user profile to get traveler_type
        try {
          const profileRes = await api.get('/api/profile/');
          console.log('Profile response:', profileRes.data);
          
          if (profileRes.data && profileRes.data.traveler_type) {
            localStorage.setItem('traveler_type', profileRes.data.traveler_type);
            console.log('Saved traveler_type to localStorage:', profileRes.data.traveler_type);
          }
        } catch (profileErr) {
          console.error('Error fetching user profile:', profileErr);
        }
        
        if (setIsAuthenticated) {
          console.log('Setting authenticated state to true');
          setIsAuthenticated(true);
        }
        
        console.log('Login successful, redirecting to dashboard');
        // Slight delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        console.error('No access token found in response');
        setError('Login failed. Invalid server response.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Log In to Your Account
        </Typography>

        {/* Google OAuth */}
        <Box sx={{ width: '100%', mt: 2, mb: 3 }}>
          <GoogleAuthButton setIsAuthenticated={setIsAuthenticated} buttonText="Log in with Google" />
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR LOG IN WITH EMAIL
          </Typography>
        </Divider>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            error={!!error}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            error={!!error}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 1, py: 1.5, borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Log In'}
          </Button>
        </form>

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            onClick={() => navigate('/password-reset')}
            color="secondary"
            disabled={loading}
            sx={{ mb: 1 }}
          >
            Forgot Password?
          </Button>

          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <Button
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

// src/components/Signup.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText, 
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GoogleAuthButton from './GoogleAuthButton';

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    traveler_type: 'casual', // Default is casual traveler
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (token && isAuth === 'true') {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Submitting signup form:', { 
        username: formData.username,
        email: formData.email,
        traveler_type: formData.traveler_type
      });
      
      const response = await api.post('/api/signup/', formData);
      console.log('Signup response:', response.data);
      
      setSuccess('Signup successful! Logging you in...');
      
      // Try to login automatically after successful registration
      try {
        console.log('Attempting automatic login after signup');
        const loginResponse = await api.post('/token/', { 
          username: formData.username, 
          password: formData.password 
        });
        
        console.log('Auto-login response:', loginResponse.data);
        
        if (loginResponse.data.access) {
          // Save authentication tokens
          localStorage.setItem('access_token', loginResponse.data.access);
          localStorage.setItem('refresh_token', loginResponse.data.refresh || '');
          localStorage.setItem('username', formData.username);
          localStorage.setItem('isAuthenticated', 'true');
          
          if (setIsAuthenticated) {
            setIsAuthenticated(true);
          }
          
          // Short delay before redirect
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (loginErr) {
        console.error('Auto-login failed after signup:', loginErr);
        // Still consider signup successful, just redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.response?.data) {
        // Handle Django REST Framework validation errors format
        if (typeof err.response.data === 'object' && !Array.isArray(err.response.data)) {
          const errorMessages = [];
          
          // Extract error messages from Django REST Framework error format
          Object.keys(err.response.data).forEach(key => {
            const errors = err.response.data[key];
            if (Array.isArray(errors)) {
              errorMessages.push(`${key}: ${errors.join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${errors}`);
            }
          });
          
          if (errorMessages.length > 0) {
            setError(errorMessages.join('\n'));
          } else {
            setError(JSON.stringify(err.response.data));
          }
        } else {
          setError(err.response?.data?.error || JSON.stringify(err.response.data));
        }
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Create Your Account
        </Typography>
        
        {/* Google Auth Button */}
        <Box sx={{ width: '100%', mt: 2, mb: 3 }}>
          <GoogleAuthButton setIsAuthenticated={setIsAuthenticated} buttonText="Sign up with Google" />
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR SIGN UP WITH EMAIL
          </Typography>
        </Divider>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Box>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel>Traveler Type</InputLabel>
            <Select
              name="traveler_type"
              value={formData.traveler_type}
              onChange={handleChange}
              required
              label="Traveler Type"
            >
              <MenuItem value="casual">
                <Box>
                  <Typography>Casual Traveler</Typography>
                  <Typography variant="caption" color="text.secondary">
                    For leisure trips, vacations, and personal travel
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="business">
                <Box>
                  <Typography>Business Traveler</Typography>
                  <Typography variant="caption" color="text.secondary">
                    For work-related trips with meeting schedules
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
            <FormHelperText>
              This will determine the type of recommendations and features you'll see
            </FormHelperText>
          </FormControl>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            type="submit" 
            sx={{ mt: 3, py: 1.5, borderRadius: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Create Account"}
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;

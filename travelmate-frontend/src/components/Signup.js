// src/components/Signup.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert, MenuItem, FormControl, InputLabel, Select, FormHelperText, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
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
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/signup/', formData);
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  const fetchRecommendations = async (tripId) => {
    try {
      setLoadingRecommendations(true);
      const response = await api.get(`/api/trips/${tripId}/recommendations/`);
      setRecommendations(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
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
          />
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
          />
          <FormControl fullWidth margin="normal">
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
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;

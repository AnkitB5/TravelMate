// src/components/Signup.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post to your signup endpoint
      await api.post('/api/signup/', { username, password });
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
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
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
          />
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

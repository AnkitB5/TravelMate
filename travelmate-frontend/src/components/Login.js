// src/components/Login.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/token/', { username, password });
      // Save the tokens (for example in localStorage)
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // Navigate to the dashboard (or home page)
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
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
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account? <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;

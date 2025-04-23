// src/components/Login.js
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography,
  Paper, Alert, CircularProgress, Box
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

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('username', username);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated?.(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        {/* ← Google button */}
        <Box textAlign="center" mb={2}>
          <GoogleAuthButton setIsAuthenticated={setIsAuthenticated} />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Login'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Button onClick={() => navigate('/password-reset')}>
            Forgot Password?
          </Button>
        </Box>
        <Box textAlign="center" mt={1}>
          Don’t have an account?{' '}
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

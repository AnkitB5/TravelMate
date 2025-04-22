import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/password-reset/', { email });
      setSuccess('Password reset email sent! Please check your inbox.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)'
          }}
        >
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ 
              color: '#1976d2',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Reset Password
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ 
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              type="submit" 
              sx={{ 
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Send Reset Link
            </Button>
          </form>
          <Typography 
            variant="body2" 
            align="center"
            sx={{ mt: 2 }}
          >
            Remember your password?{' '}
            <Button 
              onClick={() => navigate('/login')}
              sx={{ 
                textTransform: 'none',
                color: '#1976d2'
              }}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PasswordReset; 
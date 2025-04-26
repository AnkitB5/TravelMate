// src/components/PasswordResetRequest.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, CircularProgress, Link } from '@mui/material';
import { styled } from '@mui/system';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '500px',
  margin: '0 auto',
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setResetLink(null);

    try {
      const response = await fetch('http://localhost:8000/api/password-reset-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset email has been sent. Please check your inbox.');
        setEmail('');
        
        // If we're in development mode, show the reset link directly
        if (data.reset_link) {
          setResetLink(data.reset_link);
        }
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer elevation={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reset Password
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {resetLink && (
        <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
          <Typography variant="body2" gutterBottom fontWeight="bold">
            Development Mode: Use this link to reset your password:
          </Typography>
          <Box sx={{ 
            p: 2, 
            my: 1, 
            backgroundColor: 'background.default', 
            borderRadius: 1,
            maxWidth: '100%',
            overflow: 'auto',
            wordBreak: 'break-all'
          }}>
            <Link href={resetLink} target="_blank" rel="noopener">
              {resetLink}
            </Link>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Note: In production, this link would be sent to your email address.
          </Typography>
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Box>
    </FormContainer>
  );
}

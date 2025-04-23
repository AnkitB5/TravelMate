// src/components/PasswordResetRequest.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import api from '../services/api';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/password-reset/', { email });
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Is that address registered?');
    }
  };

  if (sent) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6">Check your inbox!</Typography>
        <Typography>
          We’ve emailed you a link to reset your password.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 3 }}
    >
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Your email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        Send Reset Link
      </Button>
    </Box>
  );
}

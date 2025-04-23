// src/components/PasswordResetConfirm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PasswordResetConfirm() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    try {
      await api.post(`/password-reset-confirm/${uidb64}/${token}/`, {
        new_password1: password,
        new_password2: confirm
      });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Failed to reset. Link may have expired.');
    }
  };

  if (done) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6">All set!</Typography>
        <Typography>You’ll be redirected to login shortly.</Typography>
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
        Choose New Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="New Password"
        type="password"
        fullWidth
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        required
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        Reset Password
      </Button>
    </Box>
  );
}

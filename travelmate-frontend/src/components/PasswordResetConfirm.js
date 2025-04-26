// src/components/PasswordResetConfirm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper, CircularProgress } from '@mui/material';
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

const PasswordResetConfirm = () => {
  const [passwords, setPasswords] = useState({
    password1: '',
    password2: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
  const navigate = useNavigate();
  const { uid, token } = useParams();

  // Add console logs to debug parameters
  useEffect(() => {
    console.log("Reset parameters received:", { uid, token });
    
    if (!uid || uid === 'undefined') {
      console.error("UID parameter is missing or undefined");
      setError("Missing user identifier in the reset link. Please request a new one.");
      setVerifyingToken(false);
      return;
    }
    
    if (!token || token === 'undefined') {
      console.error("Token parameter is missing or undefined");
      setError("Missing security token in the reset link. Please request a new one.");
      setVerifyingToken(false);
      return;
    }
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        console.log(`Verifying token at: http://localhost:8000/api/password-reset-validate/${uid}/${token}/`);
        const response = await fetch(`http://localhost:8000/api/password-reset-validate/${uid}/${token}/`, {
          method: 'GET',
        });

        if (response.ok) {
          setTokenValid(true);
        } else {
          setError('Invalid or expired password reset link. Please request a new one.');
        }
      } catch (error) {
        setError('Network error. Please check your connection and try again.');
      } finally {
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [uid, token]);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password1 !== passwords.password2) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          new_password1: passwords.password1,
          new_password2: passwords.password2 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Your password has been reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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

  if (verifyingToken) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Verifying reset link...
        </Typography>
      </Box>
    );
  }

  if (!tokenValid) {
    return (
      <FormContainer elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom color="error">
          Invalid Reset Link
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/password-reset')}
        >
          Request New Link
        </Button>
      </FormContainer>
    );
  }

  return (
    <FormContainer elevation={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Set New Password
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
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password1"
          label="New Password"
          type="password"
          id="password1"
          autoComplete="new-password"
          value={passwords.password1}
          onChange={handleChange}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password2"
          label="Confirm New Password"
          type="password"
          id="password2"
          autoComplete="new-password"
          value={passwords.password2}
          onChange={handleChange}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Box>
    </FormContainer>
  );
};

export default PasswordResetConfirm;

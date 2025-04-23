// src/components/GoogleAuthButton.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuthButton = ({ setIsAuthenticated }) => {
  return (
    <Box width="100%" display="flex" justifyContent="center">
      <GoogleLogin
        onSuccess={async cred => {
          const res = await fetch('http://localhost:8000/api/auth/google/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: cred.credential }),
          });
          const data = await res.json();
          if (data.key) {
            localStorage.setItem('access_token', data.key);
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated?.(true);
            window.location.replace('/dashboard');
          }
        }}
        onError={() => console.error('Google login failed')}
        render={({ onClick }) => (
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={onClick}
            sx={{ width: '100%', maxWidth: 400, py: 1.5 }}
          >
            Sign in with Google
          </Button>
        )}
      />
    </Box>
  );
};

export default GoogleAuthButton;

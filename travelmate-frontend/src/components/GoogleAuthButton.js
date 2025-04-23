import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuthButton = ({ setIsAuthenticated }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google Client ID is missing. Please check your .env file.');
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await fetch('http://localhost:8000/api/auth/google/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: credentialResponse.credential }),
          });
          const data = await res.json();
          if (data.key) {
            localStorage.setItem('access_token', data.key);
            localStorage.setItem('isAuthenticated', 'true');
            if (setIsAuthenticated) setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }}
      onError={() => {
        console.error('Login Failed');
      }}
      useOneTap
    />
  );
};

export default GoogleAuthButton;

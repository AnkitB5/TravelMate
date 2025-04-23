import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { testAuthEndpoints } from '../utils/authDebug';

const GoogleAuthButton = ({ setIsAuthenticated, buttonText = "Continue with Google" }) => {
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugResults, setDebugResults] = useState(null);

  if (!clientId) {
    console.error('Google Client ID is missing. Please check your .env file.');
    return null;
  }

  const handleGoogleResponse = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Google login successful', credentialResponse);
      
      // Store token for debugging
      const token = credentialResponse.credential;
      setGoogleToken(token);
      
      if (!token) {
        setError('No credential token found in Google response');
        return;
      }
      
      console.log('Sending token to backend...');

      const res = await fetch("http://localhost:8000/api/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // allauth needs the JWT here:
          id_token:    token,
          access_token: token,
          provider:     "google"
        }),
      });
      
      if (!res.ok) {
        console.error('Backend response not OK:', res.status, res.statusText);
        let errorText;
        try {
          errorText = await res.text();
        } catch (e) {
          errorText = 'Could not read error response';
        }
        console.error('Error response:', errorText);
        
        if (res.status === 500) {
          setError('Server error during Google authentication. Please try regular login or manual authentication.');
        } else {
          setError(`Authentication failed (${res.status}): ${errorText || res.statusText}`);
        }
        return;
      }
      
      const data = await res.json();
      console.log('Backend auth response:', data);
      
      if (data.key || data.access_token || data.token) {
        // Save the authentication token (format may vary based on backend)
        const authToken = data.key || data.access_token || data.token;
        console.log('Setting auth token in localStorage:', authToken?.substring(0, 10) + '...');
        
        localStorage.setItem('access_token', authToken);
        localStorage.setItem('refresh_token', data.refresh_token || '');
        localStorage.setItem('isAuthenticated', 'true');
        
        if (setIsAuthenticated) {
          console.log('Setting isAuthenticated state to true');
          setIsAuthenticated(true);
        }
        
        // Redirect to dashboard
        console.log('Authentication successful, redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        setError('Authentication token not found in response');
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      setError('Failed to connect to authentication service. Please try again later or use email login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    if (!googleToken) {
      setError('No Google token available for testing');
      return;
    }
    
    setLoading(true);
    setDebugResults(null);
    try {
      const results = await testAuthEndpoints(googleToken);
      setDebugResults(results);
      setDebugOpen(true);
    } catch (error) {
      console.error('Error running tests:', error);
      setError('Failed to run authentication tests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <GoogleLogin
          onSuccess={handleGoogleResponse}
          onError={(error) => {
            console.error('Google Login Failed:', error);
            setError('Google authentication failed. Please try again or use email login.');
          }}
          useOneTap
          shape="rectangular"
          text="continue_with"
          locale="en"
          theme="filled_blue"
          width="100%"
          disabled={loading}
        />
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
            }}
          >
            <CircularProgress size={24} color="inherit" />
          </Box>
        )}
      </div>
      
      {error && (
        <>
          <Alert 
            severity="error" 
            sx={{ 
              mt: 1, 
              width: '100%', 
              fontSize: '0.8rem',
            }}
          >
            {error}
          </Alert>
          {googleToken && (
            <Button 
              size="small" 
              variant="text" 
              color="primary" 
              onClick={handleRunTests}
              sx={{ mt: 1, fontSize: '0.8rem' }}
              disabled={loading}
            >
              Run Authentication Tests
            </Button>
          )}
        </>
      )}

      {/* Debug Dialog */}
      <Dialog open={debugOpen} onClose={() => setDebugOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Authentication Test Results</DialogTitle>
        <DialogContent>
          {debugResults ? (
            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {debugResults.map((result, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 1, 
                    border: '1px solid', 
                    borderColor: result.success ? 'success.main' : 'error.main',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2">
                    {result.endpoint} - {result.test}
                  </Typography>
                  <Typography variant="body2" color={result.success ? 'success.main' : 'error.main'}>
                    Status: {result.status} ({result.success ? 'Success' : 'Failed'})
                  </Typography>
                  <Typography variant="caption" component="pre" sx={{ 
                    mt: 1, 
                    p: 1, 
                    background: 'rgba(0,0,0,0.1)', 
                    overflowX: 'auto',
                    maxWidth: '100%'
                  }}>
                    {typeof result.data === 'string' 
                      ? result.data 
                      : JSON.stringify(result.data || result.error, null, 2)
                    }
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDebugOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoogleAuthButton;

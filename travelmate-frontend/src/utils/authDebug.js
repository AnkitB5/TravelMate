/**
 * Utility functions for debugging authentication issues
 */

/**
 * Tests the backend auth endpoints with different token formats
 * @param {string} token - The token to test
 */
export const testAuthEndpoints = async (token) => {
  if (!token) {
    console.error('No token provided for testing');
    return;
  }
  
  console.log('Starting auth endpoint tests with token:', token.substring(0, 10) + '...');
  
  // Test different payload formats that might be expected by the backend
  const testPayloads = [
    { name: 'id_token only', payload: { id_token: token } },
    { name: 'access_token only', payload: { access_token: token } },
    { name: 'code only', payload: { code: token } },
    { name: 'token only', payload: { token: token } },
    { name: 'google-oauth2 provider', payload: { 
      access_token: token, 
      id_token: token,
      provider: 'google-oauth2' 
    }},
    { name: 'Full payload with extras', payload: {
      access_token: token,
      id_token: token,
      code: token,
      token_type: 'id_token',
      provider: 'google-oauth2',
      backend: 'google-oauth2'
    }}
  ];
  
  // Test different endpoints
  const endpoints = [
    'http://localhost:8000/api/auth/google/',
    'http://localhost:8000/api/auth/social/google/',
    'http://localhost:8000/auth/google/',
    'http://localhost:8000/api/auth/login/google/'
  ];
  
  const results = [];
  
  // Try each combination
  for (const endpoint of endpoints) {
    for (const test of testPayloads) {
      try {
        console.log(`Testing ${endpoint} with ${test.name}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(test.payload),
        });
        
        const status = response.status;
        let data;
        
        try {
          data = await response.json();
        } catch (e) {
          data = await response.text();
        }
        
        results.push({
          endpoint,
          test: test.name,
          status,
          success: status >= 200 && status < 300,
          data
        });
        
        console.log(`Result for ${endpoint} with ${test.name}:`, status, data);
        
      } catch (error) {
        console.error(`Error testing ${endpoint} with ${test.name}:`, error);
        results.push({
          endpoint,
          test: test.name,
          status: 'Error',
          success: false,
          error: error.message
        });
      }
    }
  }
  
  console.log('Auth endpoint test results:', results);
  return results;
};

/**
 * Log current authentication state for debugging
 */
export const logAuthState = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const username = localStorage.getItem('username');
  
  console.log('Current authentication state:', {
    hasAccessToken: !!accessToken,
    accessTokenPreview: accessToken ? accessToken.substring(0, 10) + '...' : null,
    hasRefreshToken: !!refreshToken,
    isAuthenticated,
    username
  });
};

export default {
  testAuthEndpoints,
  logAuthState
}; 
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token');
  const isAuthFlag = localStorage.getItem('isAuthenticated');
  
  // Check both token existence and the explicit auth flag
  const isAuthenticated = accessToken && isAuthFlag === 'true';

  useEffect(() => {
    // Log the authentication state for debugging
    console.log('PrivateRoute authentication check:', { 
      accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'missing',
      isAuthFlag,
      isAuthenticated
    });
  }, [accessToken, isAuthFlag, isAuthenticated]);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering protected route');
  return children;
};

export default PrivateRoute; 
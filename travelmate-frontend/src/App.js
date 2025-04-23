import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

import NavBar from './components/NavBar';
import Footer from './components/footer';
import HomePage from './components/HomePage';
import TripDashboard from './components/TripDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import AboutUs from './components/AboutUs';
import WeatherForecast from './components/WeatherForecast';
import TripDetails from './components/TripDetails';
import WeatherDetails from './components/WeatherDetails';
import PackingList from './components/PackingList';
import TravelTips from './components/TravelTips';
import MeetingsView from './components/MeetingsView';
import PrivateRoute from './components/PrivateRoute';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(0,0,0,0.6)',
    },
    text: {
      primary: '#EEEEEE',
      secondary: '#CCCCCC',
    },
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
  },
  typography: {
    fontFamily: '"Inter","Helvetica Neue",sans-serif',
    h1: { color: '#FFFFFF' },
    h2: { color: '#FFFFFF' },
    body1: { color: '#EEEEEE' },
    body2: { color: '#CCCCCC' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundColor: 'rgba(0,0,0,0.6)' } } },
  },
});

function App() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Check for authentication on component mount and add event listener for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const authFlag = localStorage.getItem('isAuthenticated');
      const isAuth = token && authFlag === 'true';
      
      console.log('App: Checking authentication state', { 
        hasToken: !!token, 
        authFlag, 
        isAuth 
      });
      
      setIsAuthenticated(isAuth);
    };
    
    // Check immediately on mount
    checkAuth();
    
    // Set up listener for storage events (for cross-tab login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' || e.key === 'isAuthenticated') {
        console.log('Storage changed, updating auth state');
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          backgroundColor: 0x000000,
          color: 0x444444,      // line color
          maxDistance: 20,
          spacing: 18,
          showDots: false,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  console.log('Google Client ID:', clientId ? 'Available' : 'Missing');

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* full-screen Vanta canvas */}
        <div
          ref={vantaRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
        <Router>
          <NavBar onSearch={handleSearch} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TripDashboard searchQuery={searchQuery} />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <TripDashboard searchQuery={searchQuery} />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <PrivateRoute>
                  <TripDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId/weather"
              element={
                <PrivateRoute>
                  <WeatherDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/weather/:tripId"
              element={
                <PrivateRoute>
                  <WeatherForecast />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId/packing-list"
              element={
                <PrivateRoute>
                  <PackingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId/travel-tips"
              element={
                <PrivateRoute>
                  <TravelTips />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:tripId/meetings"
              element={
                <PrivateRoute>
                  <MeetingsView />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

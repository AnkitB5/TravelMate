// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';

import NavBar from './components/NavBar';
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
import Footer from './components/footer';
import PrivateRoute from './components/PrivateRoute';

// Reset‐password screens
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';

import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb', light: '#60a5fa', dark: '#1e40af' },
    secondary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1.1rem' },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow:
              '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': { borderColor: '#2563eb' },
            '&.Mui-focused fieldset': { borderColor: '#2563eb' },
          },
        },
      },
    },
  },
});

// Debug environment variables
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log('Current environment:', process.env.NODE_ENV);
console.log('Google Client ID:', clientId ? 'Present' : 'Missing');

if (!clientId) {
  console.error('Google Client ID is missing. Please check your .env file in the travelmate-frontend directory.');
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Sync login/logout across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'access_token') {
        setIsAuthenticated(!!e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NavBar onSearch={setSearchQuery} />

          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/signup" element={<Signup />} />

            {/* Password reset */}
            <Route
              path="/password-reset"
              element={<PasswordResetRequest />}
            />
            <Route
              path="/password-reset-confirm/:uidb64/:token"
              element={<PasswordResetConfirm />}
            />

            {/* Protected */}
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
          </Routes>

          <Footer />
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

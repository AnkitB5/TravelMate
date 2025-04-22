// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/NavBar';
import HomePage from './components/HomePage';
import TripDashboard from './components/TripDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import PasswordReset from './components/PasswordReset';
import AboutUs from './components/AboutUs';
import WeatherForecast from './components/WeatherForecast';
import Footer from './components/footer';
import TripDetails from './components/TripDetails';
import PrivateRoute from './components/PrivateRoute';
import WeatherDetails from './components/WeatherDetails';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <TripDashboard />
            </PrivateRoute>
          } />
          <Route path="/trips" element={
            <PrivateRoute>
              <TripDashboard />
            </PrivateRoute>
          } />
          <Route path="/trips/:tripId" element={
            <PrivateRoute>
              <TripDetails />
            </PrivateRoute>
          } />
          <Route path="/trips/:tripId/weather" element={<PrivateRoute><WeatherDetails /></PrivateRoute>} />
          <Route path="/weather/:tripId" element={
            <PrivateRoute>
              <WeatherForecast />
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

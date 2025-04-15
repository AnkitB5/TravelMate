// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './components/HomePage';
import TripDashboard from './components/TripDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import AboutUs from './components/AboutUs';
import WeatherForecast from './components/WeatherForecast';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<TripDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/weather/:tripId" element={<WeatherForecast />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

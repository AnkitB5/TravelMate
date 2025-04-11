// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import TripDashboard from './components/TripDashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TripDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Additional routes (e.g., for TripDetails) go here */}
      </Routes>
    </Router>
  );
}

export default App;

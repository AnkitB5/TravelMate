// src/services/api.js
import axios from 'axios';

// Set base URL to match your Django backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8001', // Django backend URL
});

// Example interceptor (optional)
api.interceptors.request.use(
  config => {
    // Optionally attach auth tokens from localStorage, etc.
    return config;
  },
  error => Promise.reject(error)
);

export default api;

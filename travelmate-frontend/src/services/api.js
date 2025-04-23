import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8000';

console.log('API service initialized with base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    // switch to Token <key> instead of Bearer <key>
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.method.toUpperCase()} ${response.config.url}:`, 
      response.status, response.statusText);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(`Error in ${originalRequest.method.toUpperCase()} ${originalRequest.url}:`, 
      error.response?.status, error.response?.statusText);

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Attempting to refresh token...');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          console.error('No refresh token available');
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        console.log('Token refreshed successfully');
        localStorage.setItem('access_token', access);
        localStorage.setItem('isAuthenticated', 'true');

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // If refresh token fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        
        console.log('Authentication cleared, redirecting to login');
        // Use setTimeout to avoid immediate redirect issues
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
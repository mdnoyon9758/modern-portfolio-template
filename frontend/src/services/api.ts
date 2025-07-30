import axios from 'axios';

// Create a new instance of axios with a custom config.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  config => {
    // You can add authorization tokens here if needed
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // Handle known errors (e.g. 401, 403, 500, etc.)
      console.error(`API error: ${error.response.status} - ${error.response.data}`);
    }
    return Promise.reject(error);
  }
);

export default api;

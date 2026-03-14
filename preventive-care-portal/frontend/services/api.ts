import axios from 'axios';

// Helper to clean up the URL and avoid double slashes
const getBaseURL = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // Remove trailing slash if present, then add /api
  return `${base.replace(/\/$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // We only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

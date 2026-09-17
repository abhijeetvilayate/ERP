import axios from 'axios';

// Base API Configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds request timeout
});

/**
 * Request Interceptor
 * Automatically attaches Authorization Header (Bearer Token) if user is logged in
 */
API.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('erp_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing stored session in API interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Centralized API response and error handling
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized (Session Expired / Invalid Token)
      if (error.response.status === 401) {
        localStorage.removeItem('erp_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.warn('Access denied: You do not have permission for this resource.');
      }
    } else if (error.request) {
      // Network Error / Server unreachable
      console.error('Network Error: Server unreachable or offline.');
    }

    return Promise.reject(error.response?.data || error.message || 'Server Error');
  }
);

export default API;
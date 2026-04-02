import axios from 'axios';

/**
 * FRONTEND STRUCTURE: API Logistics Provider
 * By utilizing an instantiated `axios.create` environment, we guarantee robust backend API connectivity 
 * consistently avoiding typing explicit URL prefixes internally through the whole React App interface.
 */
const api = axios.create({
  // Use VITE_API_URL environment variable for production (Vercel), fallback to localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AUTH FLOW: JSON Web Token Extraction Interceptor
 * Intercepts every solitary HTTP outbound request directed natively out of React.
 * Seamlessly checks the user's `localStorage` for preexisting valid tokens.
 * Inherently embeds `Bearer <JWT>` securely inside header properties enabling seamless validation interactions locally.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * AUTH FLOW: Global Response Error Catching Interceptor
 * Handles all reverse-end error management generically avoiding boilerplate catching requirements elsewhere.
 * Conditionally manages scenarios such as a 401 Unauthorized API error intelligently clearing malicious 
 * token properties and gracefully resetting the exact frontend structural routing layout natively back to `/login`.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Globally catch 401 Unauthorized errors (e.g., token expired or manipulated)
    // ONLY run this redirect if we are not currently executing a login request, 
    // to allow standard 401 credentials errors to render cleanly inline on the form.
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

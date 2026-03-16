import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vnrvjiet-blog.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Standardize on Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
      // Fallback for legacy routes if any still use x-auth-token only
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, it means the token is invalid or expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // We could use window.location.href = '/login' but it's better to let 
      // the application handle state. We'll dispatch a custom event.
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default api;

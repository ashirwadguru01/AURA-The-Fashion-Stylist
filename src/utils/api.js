import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from localStorage into headers
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing aura_user from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

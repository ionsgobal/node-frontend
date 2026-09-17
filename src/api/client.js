import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://node-backend-laci.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically intercept and mount bearer tokens in outgoing payloads
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ` + token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    if (!baseURL || baseURL.includes('localhost') || baseURL.includes('your-backend-url')) {
      const backendHostname = hostname.replace('frontend', 'backend');
      baseURL = `https://${backendHostname}/api`;
    }
  }
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

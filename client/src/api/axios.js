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

const getLocalDateString = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${monthName} ${year}`;
};

const getLocalTimeString = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const hoursStr = String(hours).padStart(2, '0');
  
  return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const localDate = getLocalDateString();
    const localTime = getLocalTimeString();
    
    config.headers['x-local-date'] = localDate;
    config.headers['x-local-time'] = localTime;
    
    // Inject into body for auth endpoints
    if (config.method === 'post' && config.url && config.url.includes('/auth/')) {
      if (typeof config.data === 'object' && config.data !== null) {
        config.data.localDate = localDate;
        config.data.localTime = localTime;
      } else if (!config.data) {
        config.data = { localDate, localTime };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

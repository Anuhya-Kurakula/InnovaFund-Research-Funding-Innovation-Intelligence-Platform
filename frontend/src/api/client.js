import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// Strip trailing /v1 or /api/v1 if present so we can mount /api
const baseOrigin = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/v1\/?$/, '').replace(/\/api\/?$/, '');

const client = axios.create({
  baseURL: `${baseOrigin}/api`,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Axios 401 Unauthorized captured:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default client;


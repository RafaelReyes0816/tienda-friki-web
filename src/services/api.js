import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5034/api', // Puerto del backend tienda-friki
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

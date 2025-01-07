import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3100/api', // Configura tu base URL
});

// Agregar interceptor para incluir el token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
    if (token) {
      config.headers['x-access-token'] = token; // Añade el token a los headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

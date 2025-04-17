// context/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('axiosInstance: Request - Authorization header set:', config.headers.Authorization);
    } else {
      console.log('axiosInstance: Request - No token found.');
    }
    return config;
  },
  (error) => {
    console.error('axiosInstance: Request error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

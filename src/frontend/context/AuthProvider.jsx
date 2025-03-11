import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Dodaj interseptor ovde
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error); // Loguj ceo error objekat
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error status:', error.response.status);
    } else {
      console.error('Error without response:', error.message);
    }
    return Promise.reject(error);
  }
);
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser ] = useState(() => {
    const savedUser  = localStorage.getItem('user');
    return savedUser  ? JSON.parse(savedUser ) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      console.log('Token set:', token);
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Set up a timer to refresh the token before it expires
      const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000; // Get expiration time
      const refreshTime = tokenExpiration - Date.now() - 30000; // Refresh 30 seconds before expiration
      const timer = setTimeout(() => {
        refreshToken(); // Call refresh token function
      }, refreshTime);
      return () => clearTimeout(timer); // Clean up the timer on unmount
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
  }, [token, user]);

  // Axios interceptor for handling token refresh
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // If the error is due to an expired token (401), try to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loop

        try {
          const response = await refreshToken();
          if (response.data && response.data.accessToken) {
            setToken(response.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return instance(originalRequest); // Retry the original request
          }
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError);
          logout(); // Log out if refresh fails
        }
      }
      return Promise.reject(error);
    }
  );
  const login = async (username, password) => {
    console.log('Logging in with username:', username);
    try {
      const response = await instance.post('/login', { username, password });
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setToken(response.data.accessToken);
        setUser (response.data.user);
        return response.data;
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      console.error('Login error:', error.message || 'Unknown error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser (null);
    navigate('/'); 
  };

  const refreshToken = async () => {
    console.log('Refreshing token...');
    try {
      const response = await instance.post('/refresh-token');
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setToken(response.data.accessToken);
        return response.data;
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      console.error('Refresh token error:', error.message || 'Unknown error');
      logout(); // Log out if refresh token fails
      throw error;
    }
  };

  const updateUser  = (newUserData) => {
    setUser ((prevUser ) => ({
      ...prevUser ,
      ...newUserData,
    }));

    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...newUserData,
    }));
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, refreshToken, setToken, user, updateUser  }}>
      {children}
    </AuthContext.Provider>
  );
};

export { instance };
export default AuthProvider;
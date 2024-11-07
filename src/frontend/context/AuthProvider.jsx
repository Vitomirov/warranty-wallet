import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser ] = useState(() => {
    // Retrieve user from localStorage if it exists
    const savedUser  = localStorage.getItem('user');
    return savedUser  ? JSON.parse(savedUser ) : null;
  });

  useEffect(() => {
    if (token && typeof token === 'string') {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await instance.post('/login', { username, password });
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
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
    localStorage.removeItem('user'); // Remove user from localStorage
    setToken(null);
    setUser (null);
  };

  const refreshToken = async () => {
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
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, refreshToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
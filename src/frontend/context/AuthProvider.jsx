import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
      const refreshTime = tokenExpiration - Date.now() - 30000;

      const timer = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/api/login', { username, password });
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setToken(response.data.accessToken);
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/api/refresh-token');
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setToken(response.data.accessToken);
        return response.data;
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...newUserData,
    }));
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, refreshToken, setToken, user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

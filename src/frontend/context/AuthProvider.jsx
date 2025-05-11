import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const AuthProvider = ({ children }) => {
  // Get token from localStorage (if available) when the app starts
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  // Get user info from localStorage (if available) on initial load  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // Automatically refresh token shortly before it expires
  useEffect(() => {
    if (token) {
      // Decode token to get expiration time
      const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;

      // Calculate time to refresh token: 30 seconds before expiration
      const refreshTime = tokenExpiration - Date.now() - 30000;

      // Set a timeout to call refreshToken
      const timer = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      // Clear timeout if token changes or component unmounts
      return () => clearTimeout(timer);
    }
  }, [token]);

  // Login user with username and password
  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/login', { username, password });

      // Save token and user info if login is successful
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
      throw error; // allow handling in the component
    }
  };

  // Logout user: clear token, user info, and redirect to home
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  // Refresh access token using backend endpoint
  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/refresh-token');

      // Update stored token if successful
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setToken(response.data.accessToken);
        return response.data;
      } else {
        throw new Error('Access token not found in response');
      }
    } catch (error) {
      // If refresh fails, log the user out
      logout();
      throw error;
    }
  };

  // Update user data in state and localStorage
  const updateUser = (newUserData) => {
    if(newUserData === null){
      // If passed null, clear user state and remove from storage
      setUser(null);
      localStorage.removeItem('user');
    } else {
      // Merge and update user data
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...newUserData,
    }));
    }
  };

  // Provide authentication values to the rest of the app
  return (
    <AuthContext.Provider value={{ token, login, logout, refreshToken, setToken, user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


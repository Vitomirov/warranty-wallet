import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const verifyToken = async (token) => {
      try {
        const response = await axios.get('http://localhost:3001/auth/verifyToken', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          console.error('User data not found in response');
          logout();
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        if (error.response && error.response.status === 403) { // Token istekao
          refreshAccessToken(refreshToken); // Pokušaj osvežavanja tokena
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      verifyToken(accessToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/refresh-token', { refreshToken });
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        verifyToken(response.data.accessToken); // Verifikuj novi pristupni token
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { username, password });

      if (response.data && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser({ username });
        return response;
      } else {
        throw new Error('Tokens not found in response');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Initialize the user state to null
  const [user, setUser] = useState(null);


  // Verify the token on mount, only run once
  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Verify the token with the server
      axios.get('http://localhost:3001/auth/verifyToken', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        console.log('Token verified:', response.data);
        // Set the user state if the token is valid
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        // Remove the token from local storage if it's invalid
        localStorage.removeItem('token');
      });
    }
  }, []);

  // Login function, takes username and password as arguments
  const login = async (username, password) => {
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('http://localhost:3001/auth/login', { username, password });
      
      // Get the token from the response
      const { token } = response.data;
      
      // Store the token in local storage
      localStorage.setItem('token', token);
      console.log('User logged in:', { username });
      
      // Set the user state
      setUser({ username });
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // Logout function, removes the token from local storage and sets user state to null
  const logout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
    setUser(null);
  };

  // Return the AuthContext provider with the user, login, and logout values
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

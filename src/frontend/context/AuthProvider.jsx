import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Initialize the user state to null
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/auth/verifyToken', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => {
          console.log('Token verified:', response.data);
          if (response.data && response.data.user) {
            setUser(response.data.user);  // Postavi korisnika u state
          } else {
            console.error('User data not found in response');
            localStorage.removeItem('token');
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        })
        .finally(() =>{
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  

  // Login function, takes username and password as arguments
  const login = async (username, password) => {
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('http://localhost:3001/auth/login', { username, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({ username }); // Set user in state
        return response;
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  // Logout function, removes the token from local storage and sets user state to null
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('User logged out');
  };

  // Return the AuthContext provider with the user, login, and logout values
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
      </AuthContext.Provider>
  );
};

export default AuthProvider;

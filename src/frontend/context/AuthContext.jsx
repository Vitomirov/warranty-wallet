import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      axios.get('http://localhost:3001/auth/verifyToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Token verified:', response);
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Logged in successfully:', response.data);
      setUser({ username }); // Pretpostavimo da je username jedinstven
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;

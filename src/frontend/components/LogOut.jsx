import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogOut() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear authentication state
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to the home page
  };

  return (
    <button onClick={handleLogout}>Log Out</button> // Trigger logout on button click
  );
}

export default LogOut;

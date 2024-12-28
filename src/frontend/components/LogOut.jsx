import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogOut() {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent default link behavior
    await logout(); // Call the logout function
    console.log("User  is logged out");
    navigate('/');
  };

  return (
        <button className="nav-link text-end"
         onClick={handleLogout}>
         Log Out
        </button>

  );
}

export default LogOut;
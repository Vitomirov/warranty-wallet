import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function LogOut() {
  const { logout } = useAuth();

  const handleLogout = async (event) => {
    event.preventDefault();
    await logout();
    console.log("User is logged out");
  };

  return (
    <Link to="/" onClick={handleLogout}>Log Out</Link>
  );
}

export default LogOut;
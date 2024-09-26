import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogOut() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    localStorage.removeItem('accessToken');
    navigate('/');
  };
  console.log("Log out");

  return (
    <Link onClick={handleLogout}>Log Out</Link>
  );
}

export default LogOut;
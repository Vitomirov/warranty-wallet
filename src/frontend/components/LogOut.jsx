import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogOut() {
  const { logout } = useAuth();
  const navigate = useNavigate();

/*   const handleLogout = () => {
    logout();
    navigate('/');
  };   */
}

export default LogOut;

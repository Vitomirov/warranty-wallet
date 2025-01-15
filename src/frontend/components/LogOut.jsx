import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LogOut = ({ className, asLink, linkTo }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (asLink) {
    // Render as a link if asLink=true - for Dashboard
    return (
      <Link to={linkTo || '/'} onClick={handleLogout} className={className}>
        Log Out
      </Link>
    );
  }

  // Render as a button by default
  return (
    <button onClick={handleLogout} className={className}>
      Log Out
    </button>
  );
};

export default LogOut;

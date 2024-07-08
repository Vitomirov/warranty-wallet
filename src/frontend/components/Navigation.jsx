import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <h1>Warranty Wallet</h1>
      {!user && (
        <>
          <Link to="/login">Log In</Link>
          <br />
          <Link to="/signup">Sign Up</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/logout" onClick={logout}>Log Out</Link>
          <br />
          <Link to="/dashboard">Dashboard</Link>

        </>
      )}
    </nav>
  );
}

export default Navigation;

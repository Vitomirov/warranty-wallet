import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';

function Navigation() {
  const { user } = useAuth();

  return (
    <nav>
      <h1>Warranty Wallet</h1>
      {!user ? (
        <>
          <Link to="/login">Log In</Link>
          <br />
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <br />
          <LogOut/>
        </>
      )}
    </nav>
  );
}

export default Navigation;
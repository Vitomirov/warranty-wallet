import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {

// Get the current user and logout function from the AuthContext
  const { user, logout } = useAuth();

// Return the navigation component
  return (
    <nav>
      <h1>Warranty Wallet</h1>

{/* Display different links based on the user's login status */}
      {!user ? (
    // If the user is not logged in, display login and signup links
         <>
            <Link to="/login">Log In</Link>
            <br />
            <Link to="/signup">Sign Up</Link>
          </>
      ) : (
    // If the user is logged in, display dashboard and logout links
    // The logout link calls the logout function when clicked
        <>
            <Link to="/dashboard">Dashboard</Link>
            <br />
            <Link to="/" onClick={logout}>Log Out</Link>
        </>
      )}
    </nav>
  );
}

export default Navigation;

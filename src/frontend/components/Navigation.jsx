import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';

function Navigation() {
  const { user } = useAuth();
  const location = useLocation();  // Access current route
  const isLandingPage = location.pathname === '/';  // Check if on landing page
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user login status on initial load
  useEffect(() => {
    // Set logged-in state based on user context or localStorage
    if (user || localStorage.getItem('token')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg py-1">
      <div className="container">
        <h1 className="h1">Warranty Wallet</h1>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav d-flex align-items-center">
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>

            {/* Render login/signup buttons only if the user is not logged in and not on the landing page */}
            {!isLoggedIn && !isLandingPage && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}

            {/* Render dashboard and logout only if the user is logged in */}
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item logout-link">
                  <LogOut />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

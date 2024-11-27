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
    setIsLoggedIn(!!(user || localStorage.getItem('token')));
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg py-2 mb-0 sticky-top">
      <div className="container-fluid">
        {/* Title on the left */}
        <h1 className="h1 mb-0">Warranty Wallet</h1>
  
        {/* Button for toggling navbar */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list"></i>
        </button>
  
        {/* Links on the right */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav ms-auto text-end">
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#FAQ">FAQ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
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
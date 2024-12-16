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
    <nav className="bg-gradient navbar navbar-expand-lg py-2 mb-0 sticky-top">
      <div className="container">
        {/* Title on the left */}
        <a className="navbar-brand" href='#'>
        <img src="src/frontend/images/Logo.png" alt="WW logo" />
        </a>
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
        <div className="collapse navbar-collapse" id="navbarNav">
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
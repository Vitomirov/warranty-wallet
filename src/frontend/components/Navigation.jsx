import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user } = useAuth();
  const location = useLocation(); // Access current route
  const isLandingPage = location.pathname === '/'; // Check if on landing page
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // Track navbar state

  // Check user login status on initial load
  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem('token')));
  }, [user]);

  const handleLinkClick = () => {
    setIsNavbarOpen(false); // Close the navbar when a link is clicked
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen); // Toggle navbar open/close
  };

  return (
    <nav className="bg-gradient navbar w-100 navbar-expand-lg py-2 mb-0 sticky-top">
      <div className="container-fluid px-5">
      <div className="navbar-content w-100 d-flex justify-content-between align-items-center px-5">
        {/* Title on the left */}
        <a className="navbar-brand" href="#">
          <img src="/Logo.png" alt="WW logo" />
        </a>
        {/* Button for toggling navbar */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Links on the right */}
        <div
          className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto text-end">
              <>
                <li className="nav-item">
                  <a className="nav-link" href="#about" onClick={handleLinkClick}>
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features" onClick={handleLinkClick}>
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#FAQ" onClick={handleLinkClick}>
                    FAQ
                  </a>
                </li>
              </>
          </ul>
        </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

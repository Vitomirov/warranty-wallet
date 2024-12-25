import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';

function Dashboard() {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user login status on initial load
  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem('token')));
  }, [user]);

  return (
    <div className="dashboard container-fluid p-5">
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'transparent' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="fs-1 mb-0 fw-bold">Welcome, {user.username}</h1>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto text-end">
              <li className="nav-item">
                <Link to="/myAccount" className="nav-link text-dark">My Account</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link text-dark">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link text-dark" onClick={LogOut}>Log Out</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div className="row p-5 mt-5">
        <div className="dashboardbutton col-lg-12 col-sm-8 d-flex justify-content-start text-center">
          <Link to="/myWarranties" className="btn btn-primary btn-lg col-lg-6 shadow">
            My Warranties
          </Link>
        </div>
      </div>
      <br />
      <div className="row p-5 mt-5">
        <div className="dashboardbutton col-lg-12 col-sm-8 d-flex justify-content-end text-center">
          <Link to="/newWarranty" className="btn btn-primary btn-lg col-lg-6 shadow">
            New Warranty
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
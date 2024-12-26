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
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent shadow-lg mb-4">
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
      
      <div className="text-center mb-5">
        <h2 className="fw-bold">Your Dashboard</h2>
        <p className="text-muted">Manage your warranties easily and efficiently.</p>
      </div>

      <div className="row justify-content-center button">
        <div className="col-lg-5 col-md-6 mb-4">
          <Link to="/myWarranties" className="btn btn-lg border w-100 shadow" style={{
            padding: '8% 5%',
            fontSize: '1.5rem',
          }}>
            My Warranties
          </Link>
        </div>
        <div className="col-lg-5 col-md-6 mb-4">
          <Link to="/newWarranty" className="btn btn-lg border w-100 shadow" style={{
            padding: '8% 5%',
            fontSize: '1.5rem',
          }}>
            New Warranty
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';
import Footer from './Footer'

function Dashboard() {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user login status on initial load
  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem('token')));
  }, [user]);

  return (
    <div className="dashboard d-flex flex-column flex-grow-1"> 
      {/* Navbar within Dashboard */}
      <nav className="bg-gradient navbar navbar-expand-lg shadow-lg mb-4 w-100">
        <div className="container-fluid py-3 d-flex justify-content-between align-items-center"
        style={{padding: '9%'}}>
          <h1 className="fs-1 mb-0 white montserrat">Welcome, {user.username}</h1>
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
                <Link to="/myAccount" className="nav-link">My Account</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <LogOut asLink={true} linkTo="/" className="nav-link btn btn-link text-white text-end" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      {/* Main content */}
      <main className="flex-grow-1 container-fluid p-5 d-flex flex-column justify-content-center"> 
        <div className="row">
          <div className="text-center mb-5">
            <h2 className="text-white fw-lighter">All your warranties in one place. Add and manage with ease.</h2>
          </div>
        </div>
  
        <div className="row justify-content-center gap-4 dashboardbutton mt-2">
  <div className="col-lg-5 col-md-6">
    <Link to="/myWarranties" className="btn btn-lg btn-md btn-sm border w-100 shadow" style={{
      padding: '4% 1%', // Adjust padding for larger screens
      fontSize: '1.5rem', // Default font size
    }}>
      &gt;&gt;&gt;My Warranties &lt;&lt;&lt;
    </Link>
  </div>
  <div className="col-lg-5 col-md-6 mb-1">
    <Link to="/newWarranty" className="btn btn-lg btn-md btn-sm border w-100 shadow" style={{
      padding: '4% 1%', // Adjust padding for larger screens
      fontSize: '1.5rem', // Default font size
    }}>
      &gt;&gt;&gt;New Warranty&lt;&lt;&lt;
    </Link>
  </div>
</div>
      </main>
    </div>
  );
}

export default Dashboard;
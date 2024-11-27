import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';


function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container dashboard">
      <div className="row align-items-start">
        <div className="col text-start">
          <p>Welcome, {user.username}</p>
        </div>
        <div className="col text-end">
          <Link to="/myAccount" className="btn btn-link">My Account</Link>
          <LogOut />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col text-center">
          <Link to="/newWarranty" className="btn btn-primary mx-2">New Warranty</Link>
          <Link to="/myWarranties" className="btn btn-primary mx-2">My Warranties</Link>
        </div>
      </div>
      <Link to="/" className="btn btn-secondary">Back</Link>
    </div>
  );
}

export default Dashboard;
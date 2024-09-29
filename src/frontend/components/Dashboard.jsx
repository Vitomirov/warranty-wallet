import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Warranty Wallet</h1>
      <p>Welcome, {user.username}</p>
      <Link to="/newWarranty">New Warranty</Link>
      <br />
      <Link to="/myWarranties">My Warranties</Link>
      <br />
      <Link to="/">Back</Link>
      </>
  );
}

export default Dashboard;

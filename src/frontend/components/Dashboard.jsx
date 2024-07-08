import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Link to="/newWarranty">New Warranty</Link>
      <br />
      <Link to="/myWarranties">My Warranties</Link>
      <br />
      <Link to="/">Home</Link>
    </>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const MyWarranties = () => {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);
  const { token, refreshToken } = useAuth(); // Get token and refreshToken from context

  const fetchWarranties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/warranties/all', {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from context
          'Content-Type': 'application/json'
        }
      });
      setWarranties(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        await refreshToken(); // Refresh token if unauthorized
        fetchWarranties(); // Retry fetching warranties after refreshing token
      } else if (error.response && error.response.status === 404) {
        setWarranties([]);
      } else {
        console.error('Error fetching warranties:', error);
        setError('Failed to fetch warranties.');
      }
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [token]); // Add token as a dependency to refetch if it changes

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4 col-6">
      <h1>{user.username}'s Warranties</h1>
      {warranties.length === 0 ? (
        <p>No warranties found.</p>
      ) : (
        <ul className="list-group mt-3">
          {warranties.map(warranty => (
            <li key={warranty.warrantyId} className="list-group-item">
              <Link to={`/warranties/details/${warranty.warrantyId}`} className="link-primary">
                {warranty.productName}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="button mt-3 d-flex justify-content-between">
        <Link to="/newWarranty" className="btn btn-primary me-2">Add a new warranty</Link>
        <Link to="/dashboard" className="btn btn-secondary">Back</Link>
      </div>
    </div>
  );
};

export default MyWarranties;
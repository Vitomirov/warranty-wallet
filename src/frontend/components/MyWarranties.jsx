import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const MyWarranties = () => {
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
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>My Warranties</h1>
      {warranties.length === 0 ? (
        <p>No warranties found.</p>
      ) : (
        <ul>
          {warranties.map(warranty => (
            <li key={warranty.warrantyId}>
              <Link to={`/warranties/details/${warranty.warrantyId}`}>
                {warranty.productName}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <br />
      <Link to="/newWarranty">Add a new warranty</Link>
      <br />
      <Link to="/dashboard">Back</Link>
    </>
  );
};

export default MyWarranties;
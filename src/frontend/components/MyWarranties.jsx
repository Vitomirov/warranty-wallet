import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyWarranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);

  const fetchWarranties = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:3001/warranties/all', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setWarranties(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        await refreshToken();
        fetchWarranties(); // Retry fetching warranties after refreshing token
      } else {
        console.error('Error fetching warranties:', error);
        setError('Failed to fetch warranties.');
      }
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await axios.post('http://localhost:3001/refresh-token', { refreshToken });
        localStorage.setItem('accessToken', response.data.accessToken);
      } catch (error) {
        console.error('Refresh token failed:', error);
      }
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

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
            <li key={warranty.id}>
              <Link to={`/warranty/${warranty.id}`}>{warranty.productName}</Link>
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

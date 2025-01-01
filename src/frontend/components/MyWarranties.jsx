import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyWarranties = () => {
  const { user, token, refreshToken } = useAuth(); // Koristi user, token i refreshToken iz konteksta
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);

  const fetchWarranties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/warranties/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setWarranties(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        await refreshToken();
        fetchWarranties();
      } else if (error.response?.status === 404) {
        setWarranties([]);
      } else {
        console.error('Error fetching warranties:', error);
        setError('Failed to fetch warranties.');
      }
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [token]); // Refetch kad se token promeni

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="myWarranties container-fluid"> {/* Removed max-vh-100 for full page */}
      <div className="row col-lg-12 d-flex align-items-center mb-4 p-1">
      <h1 className="fw-bold display-4">{user?.username}'s Warranties</h1> {/* Added margin-bottom for padding */}
      </div>
      <div className="row align-items-center ps-4">
        {/* Left Content */}
        <div className="col-lg-6 mb-0">
          {warranties.length === 0 ? (
            <p>No warranties found.</p>
          ) : (
            <div className="col-lg-10 mt-4">
              <ol className=" list-group list-group-numbered mt-3 overflow-auto" style={{ maxHeight: '55vh' }}>
                {warranties.map((warranty) => (
                  <li key={warranty.warrantyId} className="list-style list-group-item mb-2 border">
                    <Link to={`/warranties/details/${warranty.warrantyId}`} className="link-text">
                      {warranty.productName}
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="mt-3 button d-flex justify-content-between">
                <Link to="/newWarranty" className="btn btn-primary me-2">
                  Add a new warranty
                </Link>
                <Link to="/dashboard" className="btn btn-secondary">
                  Back
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* Right Content */}
        <div className="col-lg-5 d-flex justify-content-center align-items-center pt-1 mb-0">
          <div className='d-flex justify-content-end'>
            <img
              className="img-fluid"
              style={{ maxWidth: '80%', height: 'auto' }}  
              src="src/frontend/images/MyWarranties.png"
              alt="LendingPage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWarranties;
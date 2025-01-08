import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyWarranties = () => {
  const { user, token, refreshToken } = useAuth(); 
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
        const newToken = await refreshToken();
        setToken(newToken);
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
  }, [token]); 

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>; 
  }

  return (
    <div className="myWarranties container-fluid pt-1 ps-5"> 
      <div className="row col-lg-12 d-flex align-items-center mb-4 p-1">
        <h1 className="col-lg-6 col-md-4 mt-5 ps-4 display-4 $blue-dark montserrat"> {user.username}'s Warranties</h1> 
      </div>
      <div className="row align-items-start ps-3">
        {/* Content Section */}
        <div className="col-lg-6">
          {warranties.length === 0 ? (
            <p>No warranties found.</p>
          ) : (
            <div className="col-lg-10">
              <ol className="list-group list-group-numbered mt-2 overflow-auto" style={{ maxHeight: '55vh' }}>
                {warranties.map((warranty) => (
                  <li key={warranty.warrantyId} className="list-style list-group-item mb-2 border">
                    <Link to={`/warranties/details/${warranty.warrantyId}`} className="link-text">
                      {warranty.productName} 
                    </Link>
                  </li>
                ))}
              </ol>
              </div>             
          )}

        </div>

        {/* Image Section */}
        <div className="col-lg-5 d-flex justify-content-center align-items-center pt-1 mb-0">
          <div className='d-flex justify-content-end ms-5 ps-5'>
            <img
              className="img-fluid"
              style={{ maxWidth: '90%', height: 'auto' }}  
              src="src/frontend/images/MyWarranties3.png"  
              alt="LendingPage" 
            />
          </div>
        </div>
      </div>
      <div className="col-lg-5 mt-3 button d-flex justify-content-between ps-4">
              <Link to="/newWarranty" className="btn btn-primary me-2">
                Add a new warranty
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Back
              </Link>
          </div>
    </div>
  );
};

export default MyWarranties;
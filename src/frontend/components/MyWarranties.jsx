import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyWarranties = () => {
  const { user, token, setToken, logout } = useAuth();
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const isFetchingRef = useRef(false); // Ref to track fetching state
  const cancelTokenSource = useRef(null); // Ref for cancel token
  const isMounted = useRef(true); // Ref to track if component is mounted

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  };

  const fetchWarranties = async () => {
    if (isFetchingRef.current) return; // Prevent multiple fetches
    isFetchingRef.current = true; // Set fetching state

    console.log('Fetching warranties...');
    try {
      cancelTokenSource.current = axios.CancelToken.source(); // Create a new cancel token
      const response = await axios.get('http://localhost:3000/warranties/all', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cancelToken: cancelTokenSource.current.token, // Attach the cancel token
      });
      console.log('Warranties fetched successfully:', response.data);
      if (isMounted.current) { // Check if component is still mounted
        setWarranties(response.data);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching warranties:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        }
        if (isMounted.current) { // Check if component is still mounted
          setError('Failed to fetch warranties.');
        }
      }
    } finally {
      isFetchingRef.current = false; // Reset fetching state
      if (isMounted.current) { // Check if component is still mounted
        setLoading(false); // Reset loading state
      }
    }
  };

  const handleFetchWarranties = async () => {
    if (isTokenExpired(token)) {
      console.log('Access token expired, refreshing...');
      setIsRefreshing(true);
      try {
        const response = await axios.post('http://localhost:3000/refresh-token', {}, { withCredentials: true });
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
          console.log('Access token refreshed:', response.data.accessToken);
          await fetchWarranties(); // Fetch warranties after refreshing token
        } else {
          throw new Error('No access token returned');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        if (isMounted.current) { // Check if component is still mounted
          setError('Failed to refresh token.');
        }
        logout(); // Log out if refresh fails
      } finally {
        setIsRefreshing(false);
      }
    } else {
      fetchWarranties(); // Fetch warranties if token is still valid
    }
  };

  useEffect(() => {
    console.log('MyWarranties component mounted');
    isMounted.current = true; // Set mounted flag to true
    setLoading(true);
    handleFetchWarranties(); // Initial fetch on mount

    return () => {
      console.log('MyWarranties component unmounted');
      isMounted.current = false; // Set mounted flag to false on unmount
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Operation canceled by the user.'); // Cancel any ongoing requests
      }
    };
  }, [token]); // Dependency on token to re-fetch if it changes

  useEffect(() => {
    console.log('Warranties state updated:', warranties);
  }, [warranties]);

  return (
    <div className="myWarranties container-fluid pt-1 ps-5">
      <div className="row col-lg-12 d-flex align-items-center mb-4 p-1">
        <h1 className="col-lg-6 col-md-4 mt-5 ps-4 display-4 $blue-dark montserrat">
          {user.username}'s Warranties
        </h1>
      </div>
      <div className="row align-items-start ps-3">
        <div className="col-lg-6">
          {loading ? (
            <p>Loading warranties...</p>
          ) : warranties.length === 0 ? (
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
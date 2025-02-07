import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { instance } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyWarranties = () => {
  const { user, token, setToken, logout } = useAuth();
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const cancelTokenSource = useRef(null);
  const isMounted = useRef(true);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  };

  const fetchWarranties = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    console.log('Fetching warranties...');
    try {
      cancelTokenSource.current = axios.CancelToken.source();
      const response = await instance.get('/warranties/all', {
        cancelToken: cancelTokenSource.current.token,
      });
      console.log('Warranties fetched successfully:', response.data);
      if (isMounted.current) {
        setWarranties(response.data);
      }
    } catch (error) {
      console.error('Error fetching warranties:', error);
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        let errorMessage;
        if (error.response) {
          errorMessage = error.response.data || 'Failed to fetch warranties due to a server issue.';
        } else {
          errorMessage = 'Failed to fetch warranties due to a network error or server issue.';
        }
        setError(errorMessage);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleFetchWarranties = async () => {
    if (isTokenExpired(token)) {
      console.log('Access token expired, refreshing...');
      setIsRefreshing(true);
      try {
        const response = await instance.post('/refresh-token', {}, { withCredentials: true });
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
          console.log('Access token refreshed:', response.data.accessToken);

          instance.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

          await fetchWarranties();
        } else {
          throw new Error('No access token returned');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        if (isMounted.current) {
          setError('Failed to refresh token.');
        }
        logout();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      fetchWarranties();
    }
  };

  useEffect(() => {
    console.log('MyWarranties component mounted');
    isMounted.current = true;
    setLoading(true);
    handleFetchWarranties();

    return () => {
      console.log('MyWarranties component unmounted');
      isMounted.current = false;
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Operation canceled by the user.');
      }
    };
  }, [token]);

  useEffect(() => {
    console.log('Warranties state updated:', warranties);
  }, [warranties]);

  return (
    <div className="myWarranties container-fluid pt-1 ps-5 d-flex flex-column min-vh-80">
      <div className="row col-lg-12 d-flex align-items-center mb-4 p-1">
        <h1 className="col-md-8 mt-5 ps-4 display-4 $blue-dark montserrat">
          {user.username}'s Warranties
        </h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row align-items-start ps-3 flex-grow-1">
        <div className="col-md-6">
          {loading ? (
            <p>Loading warranties...</p>
          ) : (
            <div className="col-lg-10 col-md-12 col-sm-8">
              {warranties.length === 0 ? (
                <div className="d-flex flex-column">
                  <p>No warranties yet. You can add one bellow.</p>
                </div>
              ) : (
                <ol className="list-group list-group-numbered mt-2 overflow-auto" style={{ maxHeight: '55vh' }}>
                  {warranties.map((warranty) => (
                    <li key={warranty.warrantyId} className="list-style list-group-item mb-2 border">
                      <Link to={`/warranties/details/${warranty.warrantyId}`} className="link-text">
                        {warranty.productName}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
        <div className="col-md-5 d-flex justify-content-center align-items-center pt-1 mb-0">
          <div className='d-none d-md-flex justify-content-end ms-5 ps-5'>
            <img
              className="img-fluid"
              style={{ maxWidth: '90%', height: 'auto' }}
              src="/images/MyWarranties.png"
              alt="My Warranties"
            />
          </div>
        </div>
      </div>
      <div className="row d-flex align-items-center mb-3 mt-auto">
        <div className="col-lg-5 col-md-6 col-sm-8 mt-3 button d-flex justify-content-between ps-4">
          <Link to="/newWarranty" className="btn btn-primary me-2">
            Add a new warranty
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyWarranties;
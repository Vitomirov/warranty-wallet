import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { instance } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyWarranties = () => {
    const { user, token, setToken, logout, refreshToken } = useAuth();
    const [warranties, setWarranties] = useState([]);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const isFetchingRef = useRef(false);
    const cancelTokenSource = useRef(null);
    const isMounted = useRef(true);

    const fetchWarranties = async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        console.log('Fetching warranties...');
        try {
            if (!instance.defaults.headers.common.Authorization) {
                console.log('Authorization header not set!');
            } else {
                console.log('Authorization header:', instance.defaults.headers.common.Authorization);
            }
            cancelTokenSource.current = axios.CancelToken.source();
            const response = await instance.get('warranties/all', {
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
                let errorMessage = 'Failed to fetch warranties due to a server issue.';
                if (error.response) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                if (isMounted.current) {
                    setError(errorMessage);
                }
            }
        } finally {
            isFetchingRef.current = false;
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const handleFetchWarranties = async () => {
        try {
            await fetchWarranties();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('Access token expired, refreshing...');
                setIsRefreshing(true);
                try {
                    await refreshToken();
                    console.log("Token refreshed, refetching warranties.");
                    console.log(instance.defaults.headers.common.Authorization);
                    console.log("New Token:", token);
                    await fetchWarranties();
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    if (isMounted.current) {
                        setError('Session expired. Please log in again.');
                    }
                    logout();
                } finally {
                    setIsRefreshing(false);
                }
            } else {
                console.error('Error fetching warranties:', error);
                let errorMessage = 'Failed to fetch warranties due to a server issue.';
                if (error.response) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                if (isMounted.current) {
                    setError(errorMessage);
                }
            }
        }
    };

    useEffect(() => {
        console.log('MyWarranties component mounted');
        isMounted.current = true;
        setLoading(true);

        // Postavite header sinhrono
        if (token) {
            instance.defaults.headers.common.Authorization = `Bearer ${token}`;
            console.log('Authorization header set (mounting):', instance.defaults.headers.common.Authorization);
        }

        const fetchData = async () => {
            if (cancelTokenSource.current) {
                cancelTokenSource.current.cancel('Operation canceled by the user.');
            }
            await handleFetchWarranties();
        };

        fetchData();

        return () => {
            console.log('MyWarranties component unmounted');
            isMounted.current = false;
            if (cancelTokenSource.current) {
                cancelTokenSource.current.cancel('Operation canceled by the user.');
            }
        };
    }, [refreshToken, logout, token]);

    useEffect(() => {
        console.log('Warranties state updated:', warranties);
    }, [warranties]);

  return (
    <div className="myWarranties container-fluid pt-1 ps-5 d-flex flex-column min-vh-80">
      <div className="row col-lg-12 d-flex align-items-center mb-4 p-1">
        <h1 className="col-md-8 mt-5 pt-3 ps-4 display-4 $blue-dark montserrat">
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
              src="/MyWarranties.png"
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
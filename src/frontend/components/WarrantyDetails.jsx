import React, { useState, useEffect, useRef } from 'react';
import { instance } from '../context/AuthProvider';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const WarrantyDetails = () => {
    const { user, token, refreshToken, setToken, logout } = useAuth();
    const { id } = useParams();
    const [warranty, setWarranty] = useState(null);
    const [error, setError] = useState(null);
    const [issueDescription, setIssueDescription] = useState('');
    const [daysLeft, setDaysLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const isMounted = useRef(true);
    const cancelTokenSource = useRef(null);
    const isFetchingRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        console.log('WarrantyDetails: useEffect [token] - Token changed:', token);
        if (token) {
            instance.defaults.headers.common.Authorization = `Bearer ${token}`;
            console.log('WarrantyDetails: useEffect [token] - Authorization header set:', instance.defaults.headers.common.Authorization);
        } else {
            delete instance.defaults.headers.common.Authorization;
            console.log('WarrantyDetails: useEffect [token] - Authorization header cleared.');
        }
    }, [token]);

    const fetchWarranty = async () => {
        console.log('WarrantyDetails: fetchWarranty - Fetching warranty details, id:', id, 'token:', token);
        if (isFetchingRef.current) {
            console.log('WarrantyDetails: fetchWarranty - Already fetching, returning.');
            return;
        }
        isFetchingRef.current = true;

        try {
            if (!token) {
                console.error('WarrantyDetails: fetchWarranty - No token available.');
                setError('No token available. Please log in again.');
                return;
            }

            cancelTokenSource.current = axios.CancelToken.source();
            const response = await instance.get(`warranties/details/${id}`, {
                cancelToken: cancelTokenSource.current.token,
            });
            console.log('WarrantyDetails: fetchWarranty - Response:', response);

            if (typeof response.data === 'object' && response.data !== null) {
                console.log('WarrantyDetails: fetchWarranty - Warranty details fetched:', response.data);
                if (isMounted.current) {
                    setWarranty(response.data);
                }
            } else {
                console.error('WarrantyDetails: fetchWarranty - Backend returned non-JSON data:', response.data);
                if (isMounted.current) {
                    setError('Backend returned invalid data. Please check backend logs.');
                }
            }
        } catch (err) {
            console.error('WarrantyDetails: fetchWarranty - Error fetching warranty:', err);
            if (axios.isCancel(err)) {
                console.log('WarrantyDetails: fetchWarranty - Request canceled:', err.message);
            } else {
                let errorMessage = 'Failed to fetch warranty details.';
                if (err.response) {
                    errorMessage = typeof err.response.data === 'string' ? err.response.data : err.response.data?.message || errorMessage;
                } else if (err.message) {
                    errorMessage = err.message;
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

    const handleFetchWarranty = async () => {
        console.log('WarrantyDetails: handleFetchWarranty - Called, token:', token);
        try {
            await fetchWarranty();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('WarrantyDetails: handleFetchWarranty - Access token expired, refreshing...');
                setIsRefreshing(true);
                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        setToken(newToken);
                        console.log('WarrantyDetails: handleFetchWarranty - Token refreshed, new token:', newToken);
                        setTimeout(async () => {
                            console.log('WarrantyDetails: handleFetchWarranty - Refetching warranty with new token:', newToken);
                            await fetchWarranty();
                        }, 100);
                    } else {
                        console.error('WarrantyDetails: handleFetchWarranty - Token refresh failed.');
                        setError('Session expired. Please log in again.');
                        logout();
                    }
                } catch (refreshError) {
                    console.error('WarrantyDetails: handleFetchWarranty - Error refreshing token:', refreshError);
                    setError('Session expired. Please log in again.');
                    logout();
                } finally {
                    setIsRefreshing(false);
                }
            } else {
                console.error('WarrantyDetails: handleFetchWarranty - Error fetching warranty:', error);
            }
        }
    };

    const calculateDaysLeft = (expiryDate) => {
        if (!expiryDate || typeof expiryDate !== 'string') {
            console.error('Invalid expiry date:', expiryDate);
            return { days: 0, isExpired: true };
        }

        const dateParts = expiryDate.split('-');
        if (dateParts.length !== 3) {
            console.error('Invalid date format:', expiryDate);
            return { days: 0, isExpired: true };
        }

        const [day, month, year] = dateParts.map(Number);
        const expiry = new Date(year, month - 1, day);
        const currentDate = new Date();
        const daysLeft = expiry - currentDate;
        const isExpired = daysLeft <= 0;
        return { days: isExpired ? 0 : Math.floor(daysLeft / (1000 * 60 * 60 * 24)), isExpired };
    };

    useEffect(() => {
        console.log('WarrantyDetails: useEffect [id, token] - Component mounted/updated, id:', id, 'token:', token);
        const fetchData = async () => {
             if (id && token) {
                console.log('WarrantyDetails: useEffect [id, token] - Calling handleFetchWarranty.');
                await handleFetchWarranty();
            } else {
                console.log('WarrantyDetails: useEffect [id, token] - Id or token not available.');
                if (!id) console.log('WarrantyDetails: useEffect [id, token] - Id not available.');
                if (!token) console.log('WarrantyDetails: useEffect [id, token] - Token not available.');
                if (!id) setError("ID is missing");
                if (!token) setError("Token is missing");
                setLoading(false);
            }
        };
        fetchData();
        return () => {
            isMounted.current = false;
            if (cancelTokenSource.current) {
                cancelTokenSource.current.cancel('Operation canceled.');
            }
        };
    }, [id, token]);

    useEffect(() => {
        if (warranty) {
            const { days, isExpired } = calculateDaysLeft(warranty.warrantyExpireDate);
            setDaysLeft(days);
            setIsExpired(isExpired);
        }
    }, [warranty]);

    const handleOpenPDF = async () => {
        try {
            if (!warranty || !warranty.warrantyId) {
                console.error('Warranty details are not loaded yet');
                return;
            }
            console.log('Opening PDF for warranty ID:', warranty.warrantyId);
            cancelTokenSource.current = axios.CancelToken.source();
            const response = await instance.get(`/warranties/pdf/${warranty.warrantyId}`, {
                responseType: 'blob',
                cancelToken: cancelTokenSource.current.token,
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank');
        } catch (err) {
            console.error('Error fetching warranty PDF:', err);
            if (axios.isCancel(err)) {
                console.log('Request canceled:', err.message);
            } else if (err.response && err.response.status === 401) {
                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        setToken(newToken);
                        await handleOpenPDF();
                    } else {
                        setError('Session expired. Please log in again.');
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    setError('Session expired. Please log in again.');
                }
            } else {
                setError('Error fetching warranty PDF.');
            }
        }
    };

    const handleSendEmail = async () => {
        if (!warranty || !user) {
            setError('Cannot send email: Warranty or user details not available');
            return;
        }
        try {
            console.log('Sending email for warranty ID:', warranty.warrantyId);
            const response = await instance.post(`/warranty/claim`, {
                userId: user.id,
                productName: warranty.productName,
                warrantyId: warranty.warrantyId,
                username: user.username,
                fullName: user.fullName,
                userAddress: user.userAddress,
                sellersEmail: warranty.sellersEmail,
                userPhoneNumber: user.userPhoneNumber,
                issueDescription,
            });
            alert('Email sent successfully!');
        } catch (err) {
            console.error('Error sending email:', err);
            if (err.response && err.response.status === 401) {
                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        setToken(newToken);
                        await handleSendEmail();
                    } else {
                        setError('Session expired. Please log in again.');
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    setError('Session expired. Please log in again.');
                }
            } else {
                setError('Error sending email. Please try again.');
            }
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!warranty && loading) {
        return <div className="alert alert-info">Loading...</div>;
    }

    if (!warranty && !loading){
        return <div className='alert alert-info'>Warranty details not found.</div>
    }

    const imageSrc = isExpired ? '/ExpiredWarranty.png' : '/NotExpiredWarranty.png';
  return (
    <div className="warrantyDetails container-fluid d-flex flex-column flex-grow-1 pt-1 ps-5">
      <div className="row col-lg-12 mt-5 pt-4">
        <h1 className="display-5 ps-4 d-flex align-items-center montserrat">{warranty.productName} - Warranty Details</h1>
      </div>
      <div className="row align-items-center ps-3">
        <div className="col-lg-6 mb-0 ps-3">
          <div className="mb-3">
            <strong>Date of Purchase:</strong> {warranty.dateOfPurchase}
          </div>
          <div className="mb-3">
            <strong>Warranty Expiry Date:</strong> {warranty.warrantyExpireDate}
          </div>
          <div className="mb-3">
            <strong>Days Left Till Expiry:</strong> {isExpired ? "Warranty has expired" : `${daysLeft} days left`}
          </div>
          <div className="mb-3">
            <strong>Seller's Email:</strong> {warranty.sellersEmail}
          </div>
          <div className="button d-flex justify-content-between">
            <button className="btn buttonOpenWarranty ml-2" onClick={handleOpenPDF}>Open Warranty PDF</button>
          </div>
          <div className="mb-3 mt-3 col-lg-12 col-md-7">
            <textarea
              id="issueDescription"
              className="form-control"
              placeholder='Describe your issue here...'
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows="4"
              disabled={isExpired}
            />
          </div>
          <div className="col-lg-12 col-md-7 button d-flex justify-content-between mb-1 gap-1">
            <button className="btn btn-primary "
              onClick={handleSendEmail}
              disabled={isExpired}>Send Complaint</button>
              <DeleteWarranty id={warranty.warrantyId} />
              <Link to='/myWarranties' className="btn btn-primary">Back</Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-md-5 d-none d-lg-flex justify-content-end mb-5 align-items-start">
          <div className='d-flex align-items-start justify-content-end pb-3 mb-3'>
            <img
              className="img-fluid"
              style={{
                maxWidth: '400px', height: 'auto'}}
              src={imageSrc} 
              alt={isExpired ? "Expired Warranty" : "Not Expired Warranty"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetails;
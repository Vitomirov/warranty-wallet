// React and library imports
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';
import { useAuth } from '../context/AuthContext';
import useSecureRequest from '../hooks/useSecureRequest';
import axios from 'axios';

const WarrantyDetails = () => {
    const { user } = useAuth();
    const { id } = useParams();

    const { secureRequest } = useSecureRequest();

    const [warranty, setWarranty] = useState(null);
    const [error, setError] = useState(null);
    const [issueDescription, setIssueDescription] = useState('');
    const [daysLeft, setDaysLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(true);

    const isMounted = useRef(true);
    const cancelTokenSource = useRef(axios.CancelToken.source());
    const isFetchingRef = useRef(false);

    const fetchWarranty = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        try {
            const response = await secureRequest(
                'get',
                `/warranties/details/${id}`,
                {},
                { cancelToken: cancelTokenSource.current.token }
            );
            if (isMounted.current) {
                setWarranty(response.data);
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                setError(error.response?.data?.message || error.message || 'Failed to fetch warranty details.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                isFetchingRef.current = false;
            }
        }
    }, [id, secureRequest]);

    const handleOpenPDF = useCallback(async () => {
        if (!warranty?.warrantyId) return;
        setError(null);
        try {
            const response = await secureRequest(
                'get',
                `/warranties/pdf/${warranty.warrantyId}`,
                {},
                {
                    responseType: 'blob',
                    cancelToken: cancelTokenSource.current.token
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank');
        } catch (error) {
            if (!axios.isCancel(error)) {
                setError(error.response?.data?.message || error.message || 'Error fetching warranty PDF.');
            }
        }
    }, [warranty?.warrantyId, secureRequest]);

    const handleSendEmail = useCallback(async () => {
        if (!warranty || !user) {
            setError('Cannot send email: Warranty or user details not available');
            return;
        }
        setError(null);
        try {
            await secureRequest('post', `/warranty/claim`, {
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
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Error sending email. Please try again.');
        }
    }, [user, warranty, issueDescription, secureRequest]);

    const calculateDaysLeft = useCallback((expiryDate) => {
        if (!expiryDate || typeof expiryDate !== 'string') return { days: 0, isExpired: true };
        const dateParts = expiryDate.split('-');
        if (dateParts.length !== 3) return { days: 0, isExpired: true };
        const [day, month, year] = dateParts.map(Number);
        const expiry = new Date(year, month - 1, day);
        const currentDate = new Date();
        const timeLeft = expiry - currentDate;
        const isExpiredResult = timeLeft <= 0;
        return {
            days: isExpiredResult ? 0 : Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
            isExpired: isExpiredResult
        };
    }, []);

    useEffect(() => {
        if (warranty) {
            const { days, isExpired: expired } = calculateDaysLeft(warranty.warrantyExpireDate);
            setDaysLeft(days);
            setIsExpired(expired);
        }
    }, [warranty, calculateDaysLeft]);

    useEffect(() => {
        if (id) {
            fetchWarranty();
        } else {
            setError("ID is missing");
            setLoading(false);
        }

        return () => {
            isMounted.current = false;
            if (cancelTokenSource.current) {
                cancelTokenSource.current.cancel('Operation canceled.');
            }
        };
    }, [id, fetchWarranty]);

    const imageSrc = isExpired ? '/ExpiredWarranty.png' : '/NotExpiredWarranty.png';

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!warranty && loading) return <div className="alert alert-info">Loading...</div>;
    if (!warranty && !loading) return <div className='alert alert-info'>Warranty details not found.</div>;

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
                        <button className="btn btn-primary" onClick={handleSendEmail} disabled={isExpired}>
                            Send Complaint
                        </button>
                        <DeleteWarranty id={warranty.warrantyId} />
                        <Link to='/myWarranties' className="btn btn-primary">Back</Link>
                    </div>
                </div>
                <div className="col-md-5 d-none d-lg-flex justify-content-end mb-5 align-items-start">
                    <div className='d-flex align-items-start justify-content-end pb-3 mb-3'>
                        <img
                            className="img-fluid"
                            style={{ maxWidth: '400px', height: 'auto' }}
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

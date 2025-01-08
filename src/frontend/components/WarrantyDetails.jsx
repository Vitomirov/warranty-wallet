import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';
import { useAuth } from '../context/AuthContext';
import ExpiredWarrantyImage from '../images/ExpiredWarranty.png';
import NotExpiredWarrantyImage from '../images/NotExpiredWarranty.png';


const WarrantyDetails = () => {
  const { user, token, refreshToken } = useAuth(); 
  const { id } = useParams();
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const fetchWarranty = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/warranties/details/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWarranty(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshToken(); 
        if (newToken) {
          setToken(newToken); // Update the token state
          fetchWarranty(); // Call fetchWarranty once after successful refresh
        } else {
          setError('Session expired. Please log in again.');
        }
      } else if (err.response && err.response.status === 404) {
        setError('Warranty not found.'); 
      } else {
        setError('There was an error fetching the warranty details!');
      }
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    const [day, month, year] = expiryDate.split('-').map(Number);
    const expiry = new Date(year, month - 1, day); 
    const currentDate = new Date();
    const daysLeft = expiry - currentDate;
    const isExpired = daysLeft <= 0;
    const days = isExpired ? 0 : Math.floor(daysLeft / (1000 * 60 * 60 * 24));
    return { days, isExpired };
  };

  useEffect(() => {
    fetchWarranty();
  }, [id, token]); // Fetch warranty details and update on id or token change

  useEffect(() => {
    if (warranty) {
      const { days, isExpired } = calculateDaysLeft(warranty.warrantyExpireDate);
      setDaysLeft(days);
      setIsExpired(isExpired);
    }
  }, [warranty]); 

  const handleOpenPDF = async () => {
    if (!warranty || !warranty.warrantyId) {
      console.error("Warranty details are not loaded yet");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/warranties/pdf/${warranty.warrantyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          setToken(newToken); 
          handleOpenPDF(); 
        } else {
          setError('Session expired. Please log in again.');
        }
      } else {
        setError('Error fetching warranty PDF.');
      }
    }
  };

  const handleSendEmail = async () => {
    if (!warranty || !user) {
      setError("Cannot send email: Warranty or user details not available");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/warranty/claim',
        {
          userId: user.id,
          productName: warranty.productName,
          warrantyId: warranty.warrantyId,
          username: user.username,
          fullName: user.fullName,
          userAddress: user.userAddress,
          sellersEmail: warranty.sellersEmail,
          userPhoneNumber: user.userPhoneNumber,
          issueDescription
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert("Email sent successfully!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          setToken(newToken); 
          handleSendEmail(); 
        } else {
          setError('Session expired. Please log in again.');
        }
      } else {
        setError("Error sending email. Please try again.");
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!warranty) {
    return <div className="alert alert-info">Loading...</div>;
  }

  const imageSrc = isExpired 
    ? ExpiredWarrantyImage 
    : NotExpiredWarrantyImage;

  return (
    <div className="warrantyDetails container-fluid pt-1 ps-5">
      <div className="row col-lg-12 mt-5">
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
          <div className="mb-3 mt-3">
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
          <div className="button d-flex justify-content-between mb-1">
            <button className="btn btn-primary "
              onClick={handleSendEmail}
              disabled={isExpired}>Send Complaint</button>
              <DeleteWarranty id={warranty.warrantyId} />
              <Link to='/myWarranties' className="btn btn-primary">Back</Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-lg-5 d-flex justify-content-end mb-5 align-items-start">
          <div className='d-flex align-items-start justify-content-end pb-3 mb-3'>
            <img
              className="img-fluid"
              style={{
                maxWidth: '400px', height: 'auto'}}
              src= {imageSrc} 
              alt={isExpired ? "Expired Warranty" : "Not Expired Warranty"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetails;
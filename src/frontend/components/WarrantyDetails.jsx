import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';
import { useAuth } from '../context/AuthContext';

const WarrantyDetails = () => {
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const { id } = useParams();
  const { token, refreshToken, user } = useAuth();
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  // Function to fetch the warranty details from the API
  const fetchWarranty = async () => {
    if (!id) {
      setError('Invalid warranty ID');
      return;
    }
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
          fetchWarranty();
        } else {
          setError('Session expired. Please log in again.');
        }
      } else {
        setError('There was an error fetching the warranty details!');
      }
    }
  };

  // Function to calculate the remaining days until warranty expiry
  const calculateDaysLeft = (expiryDate) => {
    const [day, month, year] = expiryDate.split('-').map(Number);
    const expiry = new Date(year, month - 1, day); // month is 0-indexed in JavaScript

    const currentDate = new Date();
    const daysLeft = expiry - currentDate;

    // If the warranty is already expired
    const isExpired = daysLeft <= 0;

    // Calculate days
    const days = isExpired ? 0 : Math.floor(daysLeft / (1000 * 60 * 60 * 24));
    return { days, isExpired };
  };

  // UseEffect to fetch warranty details and calculate days left
  useEffect(() => {
    const fetchData = async () => {
      await fetchWarranty();
      if (warranty) {
        const { days, isExpired } = calculateDaysLeft(warranty.warrantyExpireDate);
        setDaysLeft(days);
        setIsExpired(isExpired);
      }
    };
    fetchData();
  }, [id, token, warranty]);

  // Function to handle opening the warranty PDF
  const handleOpenPDF = async () => {
    if (!warranty || !warranty.warrantyId) {
      console.error("Warranty details are not loaded yet");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/warranties/pdf/${warranty.warrantyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          handleOpenPDF();
        } else {
          setError('Session expired. Please log in again.');
        }
      }
    }
  };

  // Function to handle sending a complaint email
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
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
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

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Warranty Details</h1>
      <div className="mb-3">
        <strong>Product Name:</strong> {warranty.productName}
      </div>
      <div className="mb-3">
        <strong>Date of Purchase:</strong> {warranty.dateOfPurchase}
      </div>
      <div className="mb-3">
        <strong>Warranty Expiry Date:</strong> {warranty.warrantyExpireDate}
      </div>
      <div className="mb-3">
        <strong>Seller's Email:</strong> {warranty.sellersEmail}
      </div>

      {/* Display the days left till the warranty expires */}
      <div className="mb-3">
        <strong>Days Left Till Expiry:</strong> {isExpired ? "Warranty has expired" : `${daysLeft} days left`}
      </div>
      {!isExpired &&(
      <>
      <div className="mb-3">
        <label htmlFor="issueDescription">Describe issue:</label>
        <textarea
          id="issueDescription"
          className="form-control"
          placeholder='Describe your issue here...'
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          rows="4"
          disabled={isExpired} // Disable if expired
        />
      </div>

      <button className="btn btn-primary" onClick={handleSendEmail} disabled={isExpired}>Send Complaint</button>
      </>
    )}
      <button className="btn btn-secondary ml-2" onClick={handleOpenPDF}>Open Warranty PDF</button>
      <DeleteWarranty id={warranty.warrantyId} />
      <br />
      <Link to='/myWarranties' className="btn btn-link">Back</Link>
    </div>
  );
};

export default WarrantyDetails;
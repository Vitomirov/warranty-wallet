import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';
import { useAuth } from '../context/AuthContext';

const WarrantyDetails = () => {
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token, refreshToken } = useAuth();

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

  useEffect(() => {
    const fetchData = async () => {
      await fetchWarranty();
    };
    fetchData();
  }, [id, token]);

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

      // Open the PDF in a new tab
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!warranty) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Warranty Details</h1>
      <p>Product Name: {warranty.productName}</p>
      <p>Date of Purchase: {warranty.dateOfPurchase}</p>
      <p>Warranty Expire Date: {warranty.warrantyExpireDate}</p>
      <p>
        <button onClick={handleOpenPDF}>Open PDF</button>
      </p>
      <DeleteWarranty id={warranty.warrantyId} />
      <br />
      <Link to='/myWarranties'>Back</Link>
      <br />
      <Link to="/">Home</Link>
    </>
  );
};

export default WarrantyDetails;
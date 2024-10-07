import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DeleteWarranty from './DeleteWarranty';

const WarrantyDetails = () => {
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem('accessToken'); 
  
  useEffect(() => {
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
        console.error('There was an error fetching the warranty details!', err);
        setError('There was an error fetching the warranty details!');
      }
    };

    fetchWarranty();
  }, [id, token]);

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
      <DeleteWarranty id={warranty.warrantyId}/>
      <br />
      <Link to='/myWarranties'>Back</Link>
      <br />
      <Link to="/">Home</Link>
    </>
  );
};

export default WarrantyDetails;

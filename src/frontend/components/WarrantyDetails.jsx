import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const WarrantyDetails = () => {
  const { id } = useParams();
  const [warranty, setWarranty] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/warranties/${id}`)
      .then(response => {
        setWarranty(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the warranty details!', error);
      });
  }, [id]);

  if (!warranty) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Warranty Details</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <div>
        <h2>{warranty.productName}</h2>
        <p>Date of Purchase: {warranty.dateOfPurchase}</p>
        <p>Warranty Expire Date: {warranty.warrantyExpireDate}</p>
        {warranty.warrantyImage && <img src={`data:image/jpeg;base64,${Buffer.from(warranty.warrantyImage).toString('base64')}`} alt={warranty.productName} />}
      </div>
    </>
  );
};

export default WarrantyDetails;

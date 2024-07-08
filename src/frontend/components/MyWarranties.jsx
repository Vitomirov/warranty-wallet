import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyWarranties = () => {
  const [warranties, setWarranties] = useState([]);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/warranties/all');
        setWarranties(response.data);
      } catch (error) {
        console.error('Error fetching warranties:', error);
      }
    };

    fetchWarranties();
  }, []);

  return (
    <>
      <h1>My Warranties</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <ul>
        {warranties.map(warranty => (
          <li key={warranty.id}>
            <Link to={`/warranty/${warranty.id}`}>
              <h2>{warranty.productName}</h2>
            </Link>
            <p>Date of Purchase: {warranty.dateOfPurchase}</p>
            <p>Warranty Expire Date: {warranty.warrantyExpireDate}</p>
            {warranty.warrantyImage && <img src={`data:image/jpeg;base64,${Buffer.from(warranty.warrantyImage).toString('base64')}`} alt={warranty.productName} />}
          </li>
        ))}
      </ul>
    </>
  );
};

export default MyWarranties;

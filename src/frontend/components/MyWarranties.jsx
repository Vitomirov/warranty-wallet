import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const MyWarranties = () => {
  const [warranties, setWarranties] = useState([]);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        // Dobijanje tokena iz localStorage-a 
        const token = localStorage.getItem('authToken');
        console.log('Token being sent:', token);

        const response = await axios.get('http://localhost:3001/warranties/all', {
          headers: {
            Authorization: `Bearer ${token}` // Dodavanje tokena u zaglavlje zahteva
          }
        });
        console.log('Response from server:', response.data); // Proveri odgovor servera
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
      <ul>
        {warranties.length > 0 ? (
          warranties.map(warranty => (
            <li key={warranty.id}>
              <Link to={`/warranty/${warranty.id}`}>
                <h2>{warranty.productName}</h2>
              </Link>
              <p>Date of Purchase: {warranty.dateOfPurchase}</p>
              <p>Warranty Expire Date: {warranty.warrantyExpireDate}</p>
              <p>{warranty.warrantyImage && <img src={`data:image/jpeg;base64,${Buffer.from(warranty.warrantyImage).toString('base64')}`} alt={warranty.productName} />}</p>
            </li>
          ))
        ) : (
          <p>No warranties found</p>
        )}
        </ul>
        </nav>
      <Link to="/">Home</Link>
    </>
  );
};

export default MyWarranties;

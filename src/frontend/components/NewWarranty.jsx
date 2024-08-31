import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewWarranty = () => {
  const [productName, setProductName] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [warrantyExpireDate, setWarrantyExpireDate] = useState('');
  const [warrantyImage, setWarrantyImage] = useState(null);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // UseEffect hook za preuzimanje tokena iz localStorage pri inicijalnom učitavanju komponente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('dateOfPurchase', dateOfPurchase);
    formData.append('warrantyExpireDate', warrantyExpireDate);
    formData.append('warrantyImage', warrantyImage);

    try {
      const response = await axios.post('http://localhost:3001/warranties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Uključivanje tokena u zaglavlje zahteva
        },
      });
      setMessage('Warranty added successfully!');
      // Resetovanje polja forme
      setProductName('');
      setDateOfPurchase('');
      setWarrantyExpireDate('');
      setWarrantyImage(null);
    } catch (error) {
      setMessage('There was an error adding the warranty!');
      console.error('Error adding warranty:', error);
    }
  };

  return (
    <>
      <h1>Add New Warranty</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>
        <div>
          <label>Date of Purchase:</label>
          <input type="date" value={dateOfPurchase} onChange={(e) => setDateOfPurchase(e.target.value)} required />
        </div>
        <div>
          <label>Warranty Expire Date:</label>
          <input type="date" value={warrantyExpireDate} onChange={(e) => setWarrantyExpireDate(e.target.value)} required />
        </div>
        <div>
          <label>Warranty Image:</label>
          <input type="file" onChange={(e) => setWarrantyImage(e.target.files[0])} required />
        </div>
        <button type="submit">Add Warranty</button>
      </form>
      <br />
      <Link to='/dashboard'>Back</Link>
      <br />
      <Link to="/">Home</Link>
      {message && <p>{message}</p>}
    </>
  );
};

export default NewWarranty;

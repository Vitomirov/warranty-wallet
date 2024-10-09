import React, { useState, useEffect } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewWarranty = () => {
  const [productName, setProductName] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [warrantyExpireDate, setWarrantyExpireDate] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:3000/refresh-token', {}, {
        withCredentials: true
      });
      console.log('Refresh token response:', response);
      return response.data.accessToken;
    } catch (err) {
      console.error('Error refreshing token:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshToken()
      .then(token => {
        setToken(token);
      })
      .catch(error => {
        console.error('Error refreshing token:', error);
        setMessage('Error refreshing token. Please try again.');
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      console.log("Token is not available");
      return;
    }

    const formData = {
      productName,
      dateOfPurchase,
      warrantyExpireDate,
    };

    try {
      const response = await axios.post('http://localhost:3000/warranties/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      setMessage('Warranty added successfully!');

      // Resetovanje polja forme
      setProductName('');
      setDateOfPurchase('');
      setWarrantyExpireDate('');

      navigate('/myWarranties', { replace: true });
      console.log("Back to My Warranties");
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
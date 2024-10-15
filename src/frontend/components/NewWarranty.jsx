// NewWarranty component
import React, { useState } from 'react';

const NewWarranty = () => {
  const [productName, setProductName] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [warrantyExpireDate, setWarrantyExpireDate] = useState('');
  const [file, setFile] = useState(null);

  const handleAddWarranty = async () => {
    const token = localStorage.getItem('accessToken')
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('dateOfPurchase', dateOfPurchase);
    formData.append('warrantyExpireDate', warrantyExpireDate);
    formData.append('pdfFile', file);

    try {
      const response = await fetch('http://localhost:3000/warranties', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        console.log('Warranty created successfully');
      } else {
        console.error('Error creating warranty:', response.status);
      }
    } catch (error) {
      console.error('Error creating warranty:', error);
    }
  };

  return (
    <div>
      <h2>Create New Warranty</h2>
      <form>
        <label>Product Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <br />
        <label>Purchase Date:</label>
        <input type="date" value={dateOfPurchase} onChange={(e) => setDateOfPurchase(e.target.value)} />
        <br />
        <label>Expiry Date:</label>
        <input type="date" value={warrantyExpireDate} onChange={(e) => setWarrantyExpireDate(e.target.value)} />
        <br />
        <label>Upload PDF File:</label>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button type="button" onClick={handleAddWarranty}>Add Warranty</button>
      </form>
    </div>
  );
};

export default NewWarranty;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewWarranty = () => {
  const [productName, setProductName] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [warrantyExpireDate, setWarrantyExpireDate] = useState('');
  const [file, setFile] = useState(null);
  const [sellersEmail, setSellersEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Initialize useNavigate
  const navigate = useNavigate();

  const handleAddWarranty = async () => {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('dateOfPurchase', dateOfPurchase);
    formData.append('warrantyExpireDate', warrantyExpireDate);
    formData.append('pdfFile', file);
    formData.append('sellersEmail', sellersEmail);

    try {
      const response = await fetch('http://localhost:3000/warranties', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        console.log('Warranty created successfully');
        setMessage('Warranty created successfully!!!');
        
        // Navigate to My Warranties page
        navigate('/myWarranties');
      } else {
        console.error('Error creating warranty:', response.status);
      }
    } catch (error) {
      console.error('Error creating warranty:', error);
    }
  };

  return (
    <div className='newWarranty container-fluid p-5'>
      <h1>Create New Warranty</h1>
      <div className='row p-3'>
        {/* Form Section */}
        <div className=' col-lg-6 col-md-6 col-sm-12 mx-auto mt-5'>
          <form>
            <div className="mb-3">
              <label className="me-4">Product Name:</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control form-control-sm form-style" />
            </div>
            <div className="mb-3">
              <label className="me-4">Purchase Date:</label>
              <input type="date" value={dateOfPurchase} onChange={(e) => setDateOfPurchase(e.target.value)} className="form-control form-control-sm form-style" />
            </div>
            <div className="mb-3">
              <label className="me-4">Expiry Date:</label>
              <input type="date" value={warrantyExpireDate} onChange={(e) => setWarrantyExpireDate(e.target.value)} className="form-control form-control-sm form-style" />
            </div>
            <div className="mb-3">
              <label className="me-4">Seller's email:</label>
              <input type="email" value={sellersEmail} onChange={(e) => setSellersEmail(e.target.value)} className="form-control form-control-sm form-style" />
            </div>
            <div className="mb-3">
              <label className="me-4">Upload PDF File:</label>
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="form-control form-control-sm form-style" />
            </div>
            <div className="button mt-3 d-flex justify-content-between">
              {message && <p>{message}</p>}
              <button type="button" onClick={handleAddWarranty} className="btn btn-primary me-2">Add Warranty</button>
              <Link to='/dashboard' className='btn btn-secondary'>Back</Link>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className='col-lg-6 col-md -6 col-sm-12 d-flex justify-content-center align-items-center'>
          <img className="img-fluid" style={{ maxWidth: 'auto', height: '100%' }} src="src/frontend/images/NewWarranty.png" alt="New Warranty" />
        </div>
      </div>
    </div>
  );
};

export default NewWarranty;
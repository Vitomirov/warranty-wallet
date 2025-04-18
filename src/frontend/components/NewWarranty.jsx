import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSecureRequest from '../hooks/useSecureRequest';

const NewWarranty = () => {
  const [productName, setProductName] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [warrantyExpireDate, setWarrantyExpireDate] = useState('');
  const [file, setFile] = useState(null);
  const [sellersEmail, setSellersEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { secureRequest } = useSecureRequest();

  const handleAddWarranty = async () => {
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('dateOfPurchase', dateOfPurchase);
    formData.append('warrantyExpireDate', warrantyExpireDate);
    formData.append('pdfFile', file);
    formData.append('sellersEmail', sellersEmail);

    try {
      const response = await secureRequest(
        'post',
        '/api/warranties',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Warranty created successfully');
      setMessage('Warranty created successfully!!!');
      navigate('/myWarranties');
    } catch (error) {
      console.error('Error creating warranty:', error);
      setMessage('Error creating warranty.');
    }
  };

  return (
    <div className='newWarranty container-fluid pt-2 ps-5 d-flex flex-column flex-grow-1'>
      <h1 className='col-lg-6 mx-4 display-5 mt-5 pt-3 montserrat'>Create New Warranty</h1>
      <div className='row p-2'>
        <div className='col-lg-6 col-md-5 col-sm-8 mx-3 mt-1'>
          <form>
            <div className="mb-2">
              <label className="me-4">Product Name:</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="form-control form-control-md form-style"
              />
            </div>
            <div className="mb-2">
              <label className="me-4">Purchase Date:</label>
              <input
                type="date"
                value={dateOfPurchase}
                onChange={(e) => setDateOfPurchase(e.target.value)}
                className="form-control form-control-md form-style"
              />
            </div>
            <div className="mb-2">
              <label className="me-4">Expiry Date:</label>
              <input
                type="date"
                value={warrantyExpireDate}
                onChange={(e) => setWarrantyExpireDate(e.target.value)}
                className="form-control form-control-md form-style"
              />
            </div>
            <div className="mb-2">
              <label className="me-4">Seller's email:</label>
              <input
                type="email"
                value={sellersEmail}
                onChange={(e) => setSellersEmail(e.target.value)}
                className="form-control form-control-md form-style"
              />
            </div>
            <div className="mb-2">
              <label className="me-4">Upload PDF File:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control form-control-md form-style"
              />
            </div>
            <div className="button mt-5 d-flex justify-content-between">
              {message && <p>{message}</p>}
              <button
                type="button"
                onClick={handleAddWarranty}
                className="btn btn-primary me-2"
              >
                Add Warranty
              </button>
              <Link to='/dashboard' className='btn btn-secondary'>Back</Link>
            </div>
          </form>
        </div>

        <div
          className='col-lg-5 col-md-6 d-none d-md-flex justify-content-center align-items-center'
          style={{ paddingLeft: '140px' }}
        >
          <img
            className="img-fluid"
            style={{ maxWidth: 'auto', height: '450px', objectFit: 'contain' }}
            src="/NewWarranty.png"
            alt="New Warranty"
          />
        </div>
      </div>
    </div>
  );
};

export default NewWarranty;

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const DeleteWarranty = ({ id }) => {
  const { token: accessToken } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', accessToken);
      const response = await axios.delete(`http://localhost:3000/warranties/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Delete response:", response);
      setSuccess(response.data.message);
      navigate('/myWarranties', { replace: true });
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
    }
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Link onClick={handleDelete}>Delete Warranty</Link>
    </>
  );
};

export default DeleteWarranty;
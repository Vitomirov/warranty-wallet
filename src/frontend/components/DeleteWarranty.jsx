import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import useSecureRequest from '../hooks/useSecureRequest';



const DeleteWarranty = ({ id }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { secureRequest } = useSecureRequest();


  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await secureRequest('delete', `/api/warranties/delete/${id}`);
      console.log("Delete response:", response);
      setSuccess(response.data.message);
      navigate('/myWarranties', { replace: true });
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message || 'Failed to delete warranty.');
    }
  };
  

  return (
    <>
      <button
        type="button"
        className="btn btn-danger"
        onClick={openDeleteModal}
      >
        Delete Warranty
      </button>

      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Warranty Confirmation"
        className="modalWindow"
        overlayClassName="modalWindow-overlay"
        ariaHideApp={false}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <h4 className="text-center mb-3">
                Are you sure you want to delete this warranty?
              </h4>
              <p className="text-center">
                This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Yes, delete warranty
                </button>
                <button className="btn btn-secondary" onClick={closeDeleteModal}>
                  Cancel
                </button>
              </div>
              {error && <p className="text-danger mt-2 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default DeleteWarranty;
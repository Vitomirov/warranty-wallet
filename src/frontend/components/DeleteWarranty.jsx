import React, { useState } from "react";
import ReactModal from "react-modal";
import useSecureRequest from "../hooks/useSecureRequest";

// Receive onDeleteSuccess as a prop from the parent component
const DeleteWarranty = ({ id, onDeleteSuccess }) => {
  const [error, setError] = useState(null);
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
      await secureRequest("delete", `/warranties/delete/${id}`);

      // Call the parent's success callback to trigger a list update
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Close the modal after a successful deletion
      closeDeleteModal();
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message || "Failed to delete warranty.");
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
              <p className="text-center">This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-danger border-danger"
                  onClick={handleDelete}
                >
                  Yes, delete warranty
                </button>
                <button
                  className="btn btn-secondary border-secondary"
                  onClick={closeDeleteModal}
                >
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

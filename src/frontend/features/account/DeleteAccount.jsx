import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import useSecureRequest from "../../hooks/useSecureRequest";

function DeleteAccount() {
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { secureRequest } = useSecureRequest();

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async () => {
    console.log("Delete Account component called");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    try {
      await secureRequest("delete", "/me");

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear tokens from cookies
      ["accessToken", "refreshToken"].forEach((tokenName) => {
        document.cookie = `${tokenName}=; Max-Age=0; path=/;`;
        document.cookie = `${tokenName}=; Max-Age=0; path=/; domain=${window.location.hostname};`;
      });

      updateUser(null);
      alert("Your account has been deleted successfully.");
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Error deleting account:", error.response.status);
        setError(
          `Error: ${error.response.data.message || "An error occurred."}`
        );
      } else {
        console.error("Error deleting account:", error.message);
        setError("Error deleting account.");
      }
    }
  };

  return (
    <div className="ps-5">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          openDeleteModal();
        }}
      >
        Delete Account
      </button>

      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Account Confirmation"
        className="modalWindow"
        overlayClassName="modalWindow-overlay"
        ariaHideApp={false}
      >
        <div className="container-fluid help">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <h4 className="text-center mb-3">
                Are you sure you want to delete your account?
              </h4>
              <p className="text-center">
                This action cannot be undone and all your warranties will be
                deleted.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-danger border-danger"
                  onClick={handleDeleteAccount}
                >
                  Yes, delete my account
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
    </div>
  );
}

export default DeleteAccount;

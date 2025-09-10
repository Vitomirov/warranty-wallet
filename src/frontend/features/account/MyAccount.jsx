import React from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import Button from "../../ui/Button";
import DeleteAccount from "./DeleteAccount";
import useMyAccount from "../../hooks/useMyAccount";

function MyAccountModal() {
  const navigate = useNavigate();
  const {
    userData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleUpdate,
  } = useMyAccount();

  const closeModal = () => navigate("/dashboard");

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="My Account"
      className="modalWindow account"
      overlayClassName="modalWindow-overlay"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      ariaHideApp={false}
    >
      <div className="auth-card account">
        <h2 className="text-center mb-4">My Account</h2>

        <form onSubmit={handleUpdate}>
          <div className="row">
            {/* Account Information */}
            <div className="col-12 col-md-6">
              <fieldset>
                <legend>Account Information</legend>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="userEmail"
                  placeholder="Email"
                  value={userData.userEmail}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>

            {/* Personal Information */}
            <div className="col-12 col-md-6">
              <fieldset>
                <legend>Personal Information</legend>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="userAddress"
                  placeholder="Address"
                  value={userData.userAddress}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="userPhoneNumber"
                  placeholder="Phone Number"
                  value={userData.userPhoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons mt-3 d-flex justify-content-between">
            <Button type="submit" variant="primary">
              Update Account
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>

          {successMessage && (
            <div className="alert alert-success mt-2 text-center">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </ReactModal>
  );
}

export default MyAccountModal;

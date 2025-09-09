import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import Button from "../../ui/Button";
import useSignUp from "../../hooks/useSignUp";

function SignUp() {
  const navigate = useNavigate();
  const { handleSignUp, message, loading } = useSignUp();
  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    userAddress: "",
    userPhoneNumber: "",
  });

  const closeSignUpModal = () => navigate("/");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={closeSignUpModal}
      contentLabel="Sign Up"
      className="modalWindow signup"
      overlayClassName="modalWindow-overlay"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      ariaHideApp={false}
    >
      <div className="auth-card">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <fieldset>
                <legend>Account Information</legend>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="userEmail"
                  placeholder="Email"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>

            <div className="col-12 col-md-6">
              <fieldset>
                <legend>Personal Information</legend>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="userAddress"
                  placeholder="Address"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="userPhoneNumber"
                  placeholder="Phone"
                  value={formData.userPhoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>
          </div>

          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}

          <div className="form-buttons mt-3 d-flex justify-content-between">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={closeSignUpModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}

export default SignUp;

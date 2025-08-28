import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import Button from "../../ui/Button";
import useSignUp from "../../hooks/useSignUp";

function SignUp() {
  const navigate = useNavigate();

  // Custom hook for handling sign-up logic (API calls, state, navigation)
  const { handleSignUp, message, loading } = useSignUp();

  // Manages all form input data in a single state object
  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    userAddress: "",
    userPhoneNumber: "",
  });

  // Navigates to the homepage and closes the modal
  const closeSignUpModal = () => {
    navigate("/");
  };

  // Handles form submission by passing data to the custom hook
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(formData);
  };

  // Updates form state for all inputs dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={closeSignUpModal}
      contentLabel="Sign Up"
      className="modalWindow"
      overlayClassName="modalWindow-overlay"
      ariaHideApp={false}
    >
      <div className="container-fluid help">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Account Information */}
                <div className="col-12 col-md-6">
                  <fieldset className="border p-3 rounded">
                    <legend className="float-none w-auto px-2">
                      Account Information
                    </legend>
                    <div className="mb-3 form-floating">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="username">Username</label>
                    </div>
                    <div className="mb-3 form-floating">
                      <input
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="userEmail">Email</label>
                    </div>
                    <div className="mb-3 form-floating">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </fieldset>
                </div>

                {/* Personal Information */}
                <div className="col-12 col-md-6">
                  <fieldset className="border p-3 rounded">
                    <legend className="float-none w-auto px-2">
                      Personal Information
                    </legend>
                    <div className="mb-3 form-floating">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="fullName">Full Name</label>
                    </div>
                    <div className="mb-3 form-floating">
                      <input
                        id="userAddress"
                        name="userAddress"
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={formData.userAddress}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="userAddress">Address</label>
                    </div>
                    <div className="mb-3 form-floating">
                      <input
                        id="userPhoneNumber"
                        name="userPhoneNumber"
                        type="tel"
                        className="form-control"
                        placeholder="Phone"
                        value={formData.userPhoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="userPhoneNumber">Phone</label>
                    </div>
                  </fieldset>
                </div>
              </div>

              {message && (
                <div className="alert alert-info mt-4 text-center" role="alert">
                  {message}
                </div>
              )}

              <div className="d-flex justify-content-between gap-3 mt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeSignUpModal}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default SignUp;

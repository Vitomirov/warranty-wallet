import React, { useState } from "react";
import Button from "../../ui/Button";
import useSignUp from "../../hooks/useSignUp";
import useLogin from "../../hooks/useLogin"; // koristimo cancel iz login hooka
import { useNavigate } from "react-router-dom";

function SignUp() {
  const { handleCancel } = useLogin();
  const { handleSignUp, message, loading } = useSignUp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    userAddress: "",
    userPhoneNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-5">
      <div className="auth-card">
        <h2 className="text-center mb-4">Sign Up</h2>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <form onSubmit={handleSubmit} role="form">
              <div className="row">
                {/* Account Information Section */}
                <div className="col-12">
                  <fieldset className="mb-3">
                    <legend>Account Information</legend>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        name="userEmail"
                        placeholder="Email"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-1">
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </fieldset>
                </div>

                {/* Personal Information Section */}
                <div className="col-12">
                  <fieldset className="mb-2">
                    <legend>Personal Information</legend>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="userAddress"
                        placeholder="Address"
                        value={formData.userAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-1">
                      <input
                        type="tel"
                        className="form-control"
                        name="userPhoneNumber"
                        placeholder="Phone"
                        value={formData.userPhoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </fieldset>
                </div>
              </div>

              {message && (
                <div className="alert alert-info mt-3 text-center">
                  {message}
                </div>
              )}

              <div className="form-buttons d-flex justify-content-between">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Back
                </Button>
              </div>
            </form>

            {/* Navigate to log in */}
            <div className="text-center mt-2">
              <p>Already have an account? Please log in.</p>
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

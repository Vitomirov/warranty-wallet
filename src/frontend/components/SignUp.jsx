import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSecureRequest from "../hooks/useSecureRequest";

function SignUp() {
  const { login } = useAuth(); // Use login function from AuthContext
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { secureRequest } = useSecureRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !username ||
      !userEmail ||
      !password ||
      !fullName ||
      !userAddress ||
      !userPhoneNumber
    ) {
      setMessage("Please populate all fields.");
      return;
    }

    try {
      // Make the signup request
      const response = await secureRequest("post", "/signup", {
        username,
        userEmail,
        password,
        fullName,
        userAddress,
        userPhoneNumber,
      });

      // Check if signup was successful
      if (response.data) {
        setMessage("Signup successful! Logging you in...");
        await login(username, password);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Failed to sign up");
      console.error(error);
    }
  };

  return (
    <section
      id="signup"
      className="d-flex justify-content-center align-items-center flex-grow-1 py-5"
    >
      <div className="content-layout w-100 d-flex justify-content-center align-items-center help">
        <div className="w-100">
          <h1 className="text-center mb-5 montserrat">Sign Up</h1>
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
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <label htmlFor="fullName">Full Name</label>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      id="address"
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      required
                    />
                    <label htmlFor="address">Address</label>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      id="phoneNumber"
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      value={userPhoneNumber}
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      required
                    />
                    <label htmlFor="phoneNumber">Phone</label>
                  </div>
                </fieldset>
              </div>
            </div>

            {message && (
              <div className="alert alert-info mt-4" role="alert">
                {message}
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
              <Link to="/" className="btn btn-secondary">
                Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;

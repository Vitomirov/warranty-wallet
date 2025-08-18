import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import useSecureRequest from "../hooks/useSecureRequest";

function MyAccount() {
  const { secureRequest } = useSecureRequest();
  const { token, updateUser } = useAuth(); // Get the token and updateUser from the AuthContext
  console.log("Token being sent:", token);
  const [userData, setUser] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    userAddress: "",
    userPhoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }
        console.log("Token being sent:", token);

        const response = await secureRequest("get", "/me");
        if (response.data) {
          setUser({
            username: response.data.username || "",
            userEmail: response.data.userEmail || "",
            password: "",
            fullName: response.data.fullName || "",
            userAddress: response.data.userAddress || "",
            userPhoneNumber: response.data.userPhoneNumber || "",
          });
        }
      } catch (error) {
        if (error.response) {
          console.error("Error fetching user data:", error.response.status);
          setError(
            `Error: ${error.response.data.message || "An error occurred."}`
          );
        } else {
          console.error("Error fetching user data:", error.message);
          setError("Error fetching user data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    try {
      await secureRequest("put", "/me", userData);
      setSuccessMessage("Account information updated successfully.");
      setError(null);

      // Fetch updated user data
      const response = await secureRequest("get", "/me");
      updateUser(response.data); // Call updateUser  to update context with new user data
    } catch (error) {
      if (error.response) {
        console.error(
          "Error updating account information:",
          error.response.status
        );
        setError(
          `Error: ${error.response.data.message || "An error occurred."}`
        );
      } else {
        console.error("Error updating account information:", error.message);
        setError("Error updating account information.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section
      id="myAccount"
      className="d-flex justify-content-center align-items-center flex-grow-1"
    >
      <div className="content-layout w-100">
        <h1 className="text-center mb-5 montserrat">My Account</h1>
        <form onSubmit={handleUpdate}>
          <div className="row g-4">
            {/* Account Information fieldset */}
            <div className="col-12 col-md-6">
              <fieldset className="border p-3 rounded h-100">
                <legend className="float-none w-auto px-2">
                  Account Information
                </legend>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  />
                  <label htmlFor="username">Username</label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="userEmail">Email</label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </fieldset>
            </div>

            {/* Personal Information fieldset */}
            <div className="col-12 col-md-6">
              <fieldset className="border p-3 rounded h-100">
                <legend className="float-none w-auto px-2">
                  Personal Information
                </legend>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                  <label htmlFor="fullName">Full Name</label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="userAddress"
                    name="userAddress"
                    value={userData.userAddress}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                  />
                  <label htmlFor="userAddress">Address</label>
                </div>
                <div className="mb-3 form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="userPhoneNumber"
                    name="userPhoneNumber"
                    value={userData.userPhoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                  />
                  <label htmlFor="userPhoneNumber">Phone Number</label>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-container mt-4 help">
            <button type="submit" className="btn btn-primary">
              Update Account
            </button>
            <div className="d-flex gap-2">
              <DeleteAccount />
            </div>
          </div>
          <div className="button-container mt-4 help d-flex justify-content-end">
            <Link to="/dashboard" className="btn btn-secondary help">
              Back
            </Link>
          </div>

          {successMessage && (
            <p className="text-success mt-2">{successMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default MyAccount;

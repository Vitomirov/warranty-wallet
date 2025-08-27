import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { Link } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import useSecureRequest from "../../hooks/useSecureRequest";

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
      className="d-flex justify-content-center align-items-end flex-grow-1"
    >
      <div className="container">
        <h2 className="text-center mb-3 montserrat fs-4">My Account</h2>

        <form onSubmit={handleUpdate} className="card shadow-sm p-3 border-0">
          <div className="row g-3">
            {/* Account Information */}
            <div className="col-12 col-md-6">
              <fieldset className="border p-2 rounded h-100">
                <legend className="fs-6 px-2">Account</legend>

                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    id="userEmail"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </fieldset>
            </div>

            {/* Personal Information */}
            <div className="col-12 col-md-6">
              <fieldset className="border p-2 rounded h-100">
                <legend className="fs-6 px-2">Personal</legend>

                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="userAddress"
                    name="userAddress"
                    value={userData.userAddress}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="userPhoneNumber"
                    name="userPhoneNumber"
                    value={userData.userPhoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </fieldset>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column gap-2 mt-3">
            <button type="submit" className="btn btn-primary btn-sm w-100">
              Update Account
            </button>
            <DeleteAccount />
            <Link
              to="/dashboard"
              className="btn btn-outline-secondary btn-sm w-100"
            >
              Back
            </Link>
          </div>

          {successMessage && (
            <p className="text-success mt-2 text-center small">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default MyAccount;

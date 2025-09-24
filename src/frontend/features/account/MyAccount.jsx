import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useMyAccount from "../../hooks/useMyAccount";

// Dynamic import
const DeleteAccount = lazy(() => import("./DeleteAccount"));
const Button = lazy(() => import("../../ui/Button"));

function MyAccount() {
  const navigate = useNavigate();
  const {
    userData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleUpdate,
  } = useMyAccount();

  const handleCancel = () => navigate("/dashboard");

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container col-12 col-md-10 col-lg-8 my-5">
      <h1 className="text-center mb-4">My Account</h1>

      <div className="row justify-content-center">
        <div className="col-12">
          <form onSubmit={handleUpdate}>
            {/* Account Information */}
            <fieldset className="mb-3">
              <legend>Account Information</legend>
              <div className="mb-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="email"
                  name="userEmail"
                  placeholder="Email"
                  value={userData.userEmail}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </fieldset>

            {/* Personal Information */}
            <fieldset className="mb-3">
              <legend>Personal Information</legend>
              <div className="mb-2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="userAddress"
                  placeholder="Address"
                  value={userData.userAddress}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="tel"
                  name="userPhoneNumber"
                  placeholder="Phone Number"
                  value={userData.userPhoneNumber}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </fieldset>

            {/* Buttons Layout */}
            <div className="d-flex justify-content-between gap-2 mt-3">
              <Suspense>
                {" "}
                <Button type="submit" variant="primary">
                  Update
                </Button>
              </Suspense>

              <Suspense>
                <DeleteAccount />
              </Suspense>
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <Suspense>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Back
                </Button>
              </Suspense>
            </div>
          </form>
        </div>
      </div>
      {successMessage && (
        <div className="alert alert-success mt-2 text-center">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default MyAccount;

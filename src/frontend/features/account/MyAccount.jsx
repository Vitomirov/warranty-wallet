import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useMyAccount from "../../hooks/useMyAccount";

// Lazy load components
const DeleteAccount = lazy(() => import("./DeleteAccount"));
const Button = lazy(() => import("../../ui/Button"));

const MyAccount = () => {
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

  // Field definitions to reduce repetition
  const accountFields = [
    { name: "username", type: "text", placeholder: "Username" },
    { name: "userEmail", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
  ];

  const personalFields = [
    { name: "fullName", type: "text", placeholder: "Full Name" },
    { name: "userAddress", type: "text", placeholder: "Address" },
    { name: "userPhoneNumber", type: "tel", placeholder: "Phone Number" },
  ];

  const renderFields = (fields) =>
    fields.map((f) => (
      <div key={f.name} className="mb-2">
        <input
          type={f.type}
          name={f.name}
          placeholder={f.placeholder}
          value={userData[f.name]}
          onChange={handleInputChange}
          required
          className="form-control"
        />
      </div>
    ));

  return (
    <div className="container col-12 col-md-10 col-lg-8 my-5">
      <h1 className="text-center mb-4">My Account</h1>
      <div className="row justify-content-center">
        <div className="col-12">
          <form onSubmit={handleUpdate}>
            <fieldset className="mb-3">
              <legend>Account Information</legend>
              {renderFields(accountFields)}
            </fieldset>

            <fieldset className="mb-3">
              <legend>Personal Information</legend>
              {renderFields(personalFields)}
            </fieldset>

            <div className="d-flex justify-content-between gap-2 mt-3">
              <Suspense>
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
};

export default MyAccount;

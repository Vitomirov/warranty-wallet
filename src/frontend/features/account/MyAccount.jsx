import { Link } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import Button from "../../ui/Button";
import useMyAccount from "../../hooks/useMyAccount";

function MyAccount() {
  const {
    userData,
    loading,
    error,
    successMessage,
    handleInputChange,
    handleUpdate,
  } = useMyAccount();

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
          <div className="gap-2 mt-3 help d-flex justify-content-between">
            <Button type="submit" variant="primary">
              Update Account
            </Button>

            <DeleteAccount />
          </div>
          <div className="help d-flex justify-content-end mt-2">
            <Link to="/dashboard">
              <Button variant="secondary">Back</Button>
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

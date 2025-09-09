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
    <section className="d-flex justify-content-center flex-grow-1 py-4">
      <div className="container">
        <div className="auth-card">
          <h2 className="text-center mb-4">My Account</h2>

          <form onSubmit={handleUpdate}>
            <div className="row g-4">
              {/* Account Information */}
              <div className="col-12 col-md-6">
                <fieldset className="border p-3 rounded h-100">
                  <legend className="fs-6 px-2">Account</legend>

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

              {/* Personal Information */}
              <div className="col-12 col-md-6">
                <fieldset className="border p-3 rounded h-100">
                  <legend className="fs-6 px-2">Personal</legend>

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
            <div className="d-flex justify-content-between gap-3 mt-4">
              <Button type="submit" variant="primary">
                Update Account
              </Button>
              <DeleteAccount />
            </div>

            <div className="d-flex justify-content-end mt-3">
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
      </div>
    </section>
  );
}

export default MyAccount;

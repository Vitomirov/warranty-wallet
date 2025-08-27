import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

function LogIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  const closeLoginModal = () => {
    setShowLoginModal(false);
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      console.log("Calling login function with username:", username);
      const response = await login(username, password);
      if (response && response.accessToken) {
        console.log("Login successful:", response.accessToken);
        navigate("/dashboard");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError("Login failed: Wrong username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReactModal
      isOpen={showLoginModal}
      onRequestClose={closeLoginModal}
      contentLabel="Log In"
      className="modalWindow"
      overlayClassName="modalWindow-overlay"
      ariaHideApp={false}
    >
      <div className="container-fluid help">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <h2 className="text-center mb-4">Log In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="mb-4 form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>

              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex justify-content-between gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeLoginModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default LogIn;

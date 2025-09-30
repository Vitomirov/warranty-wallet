import React from "react";
import Button from "../../ui/Button";
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const {
    username,
    password,
    error,
    loading,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleCancel,
  } = useLogin();

  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="auth-card">
        <h2 className="text-center mb-4">Log In</h2>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <form onSubmit={handleSubmit} role="form">
              <div className="mb-3 form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
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
                  onChange={handlePasswordChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>

              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex justify-content-between gap-3 mb-3">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Logging In..." : "Log In"}
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

            <div className="text-center mt-4">
              <p>Don't have an account? Please sign up.</p>
              <Button
                type="button"
                variant="auth-change"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;

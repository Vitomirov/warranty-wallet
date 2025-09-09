import React from "react";
import ReactModal from "react-modal";
import Button from "../../ui/Button";
import useLogin from "../../hooks/useLogin";

function LogIn() {
  const {
    username,
    password,
    error,
    loading,
    showLoginModal,
    closeLoginModal,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
  } = useLogin();

  return (
    <ReactModal
      isOpen={showLoginModal}
      onRequestClose={closeLoginModal}
      contentLabel="Log In"
      className="modalWindow"
      overlayClassName="modalWindow-overlay"
      ariaHideApp={false}
    >
      <div className="auth-card">
        <h2 className="text-center mb-4">Log In</h2>

        {/* Centriranje uže forme */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <form onSubmit={handleSubmit}>
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

              <div className="d-flex justify-content-between gap-3">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Logging In..." : "Log In"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeLoginModal}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default LogIn;

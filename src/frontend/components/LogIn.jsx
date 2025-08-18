import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <section
      id="login"
      className="d-flex justify-content-center align-items-center flex-grow-1 help "
    >
      <div className="content-layout w-100 d-flex justify-content-center align-items-center help">
        <div className="w-100" style={{ maxWidth: "600px" }}>
          <h1 className="text-center mb-5 montserrat">Log In</h1>
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
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
              <Link className="btn btn-secondary" to="/">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response && response.accessToken) {
        console.log('Login successful:', response.accessToken);
        navigate('/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login container-fluid pt-5" style={{ minHeight: '80vh' }}>
      <div className="row d-flex justify-content-center align-items-center" style={{ height: '80%' }}>
        {/* Left Column - Form */}
        <div className="col-12 col-sm-8 col-md-5">
          <h1 className="text-center mb-4 montserrat">Log In</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 form-floating">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="mb-3 form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            {error && <div className="alert alert-danger" role="alert" aria-live="assertive">{error}</div>}
            <div className="button d-flex justify-content-between">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
              </button>
              <Link className="btn btn-secondary" to='/'>Back</Link>
            </div>
          </form>
        </div>
  
        {/* Right Column - Image */}
        <div className="col-md-6 d-none d-md-flex justify-content-end">
          <img
            src="/SignUp.png"
            alt="Login Illustration"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
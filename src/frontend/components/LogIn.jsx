import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    <div className="container mt-5">
      <h1 className="text-center">Warranty Wallet</h1>
      <div className='row justify-content-center'>
      <form onSubmit={handleSubmit} className="mt-4 col-md-6">
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
          <label for="username">Username</label>
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
          <label for="password">Password</label>  
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className='button'>
            <button type="submit" className="button btn btn-primary" disabled={loading}>
                    {loading ? 'Logging In...' : 'Log In'}
            </button>
        </div>
          <div >
          <Link to="/">Back</Link>
        </div>
        
        </form>
      </div>
    </div>
  );
};

export default Login;
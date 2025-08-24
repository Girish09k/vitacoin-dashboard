import React, { useState } from 'react';
import { login } from '../api/authApi';
import { Link } from 'react-router-dom';
import '../styles/auth.css';  // Import the CSS with styles

const Login = ({ setToken, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login({ username, password });
      setToken(data.token);
      setUserId(data.userId);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <div className="auth-link-row">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
          <Link to="/signup" className="auth-link">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/password/request-reset', { username });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset request');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>

        {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Send Reset Instructions</button>
        </form>

        <p>
          Remembered password? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

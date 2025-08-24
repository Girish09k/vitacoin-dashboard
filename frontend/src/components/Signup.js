import React, { useState } from 'react';
import { signup } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');        
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');  // <-- added phone state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Simple email validation regex
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation before sending to backend
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }

    try {
      await signup({ username, email, password, phone });  // <-- send phone here
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Signup</h2>
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
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <input
            type="text"
            placeholder="Phone Number"
            className="auth-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Signup</button>
        </form>
        <div className="auth-link-row">
          <Link to="/login" className="auth-link">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

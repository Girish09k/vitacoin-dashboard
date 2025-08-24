import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Settings.css';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api/users';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');  // <-- added phone state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch profile on mount
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
        setPhone(res.data.phone || '');  // <-- set phone
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!username || !email || !phone) {
      setError('Username, email and phone are required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE}/profile`,
        { username, email, phone },  // <-- include phone in update body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: '400px', margin: 'auto' }}>
      <h2>Settings</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </label>
        <br />
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </label>
        <br />
        <label>
          Phone
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={loading}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Settings;

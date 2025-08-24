import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/notificationSupport.css';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api/support';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Updated handleSubmit using direct axios.post with headers config
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, { subject, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Ticket created successfully!');
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err) {
      setMessage('Failed to create ticket.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Support - Raise a Ticket</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: '300px', marginBottom: '10px' }}
        />
        <br />
        <textarea
          placeholder="Describe your issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          style={{ width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit">Submit Ticket</button>
      </form>

      <h3>Your Tickets</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <strong>{ticket.subject}</strong> - {ticket.status} (Created: {new Date(ticket.createdAt).toLocaleString()})
            <p>{ticket.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Support;

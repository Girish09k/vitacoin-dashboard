import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Helper: attach JWT token if present
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// --------------------
// User APIs
// --------------------
// Fetch user dashboard info for logged-in user (no userId param needed)
export const fetchUserDashboard = () =>
  axios.get(`${API_BASE}/users/profile`, getAuthHeaders())
    .then(res => res.data);

// Fetch user's badges progress (profile based, no userId param)
export const fetchUserBadges = () =>
  axios.get(`${API_BASE}/badges/progress`, getAuthHeaders())
    .then(res => res.data);

// Transactions still require userId because no profile-based endpoint
export const fetchUserTransactions = (userId) =>
  axios.get(`${API_BASE}/transactions/${userId}`, getAuthHeaders())
    .then(res => res.data);

// --------------------
// Leaderboard API
// --------------------
export const fetchLeaderboard = () =>
  axios.get(`${API_BASE}/leaderboard`, getAuthHeaders())
    .then(res => res.data);


    
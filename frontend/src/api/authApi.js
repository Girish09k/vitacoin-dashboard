import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const signup = (data) =>
  axios.post(`${API_BASE}/auth/signup`, data).then(res => res.data);

export const login = (data) =>
  axios.post(`${API_BASE}/auth/login`, data).then(res => res.data);

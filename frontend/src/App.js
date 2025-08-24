import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import RewardNotifications from './components/RewardNotifications';
import Settings from './components/Settings';
import FAQ from './components/FAQ';
import Support from './components/Support';
import BadgeProgress from './components/BadgeProgress';
import './styles/global.css';

// Reusable simple placeholder component
function Placeholder({ text }) {
  return <div style={{ padding: 30, fontSize: 22 }}>{text}</div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  useEffect(() => {
    if (token && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }, [token, userId]);

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login setToken={setToken} setUserId={setUserId} />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/forgot-password"
          element={token ? <Navigate to="/" replace /> : <ForgotPassword />}
        />
        <Route
          path="/"
          element={token ? <Dashboard userId={userId} token={token} logout={logout} /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/settings" 
          element={token ? <Settings /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/support" 
          element={token ? <Support /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/faq" 
          element={token ? <FAQ /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/notifications" 
          element={token ? <RewardNotifications /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/badges" 
          element={token ? <BadgeProgress badges={[]} /> : <Navigate to="/login" replace />} 
        />
        {/* 404 Not Found fallback */}
        <Route 
          path="*" 
          element={<Placeholder text="404 - Page Not Found" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

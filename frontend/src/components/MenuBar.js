import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaQuestionCircle, FaLifeRing } from 'react-icons/fa'; // For icons

// Import the CSS file with correct path and extension
import '../styles/MenuBar.css';

const MenuBar = ({ username, onLogout, notificationCount }) => {
  const navigate = useNavigate();

  return (
    <nav className="menu-bar">
      <div className="menu-left">
        <span className="menu-logo">Vitacoin</span>
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/badges" className="menu-link">Badges</Link>
        <Link to="/leaderboard" className="menu-link">Leaderboard</Link>
        <Link to="/notifications" className="menu-link">
          <FaBell />
          {notificationCount > 0 && <span className="notif-dot">{notificationCount}</span>}
        </Link>
        <Link to="/support" className="menu-link"><FaLifeRing /> Support</Link>
        <Link to="/faq" className="menu-link"><FaQuestionCircle /> FAQ</Link>
      </div>
      <div className="menu-right">
        <span className="menu-username"><FaUserCircle /> {username}</span>
        <button className="menu-icon-btn" onClick={() => navigate('/settings')}><FaCog /></button>
        <button className="menu-icon-btn" onClick={onLogout}><FaSignOutAlt /></button>
      </div>
    </nav>
  );
};

export default MenuBar;

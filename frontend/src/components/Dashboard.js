import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuBar from './MenuBar';
import Balance from './Balance';
import TransactionHiFlow from './TransactionHiFlow';
import BadgeProgress from './BadgeProgress';
import Leaderboard from './Leaderboard';
import RewardNotifications from './RewardNotifications';
import { fetchUserDashboard, fetchUserBadges } from '../api/api';
import { useSocket } from '../contexts/SocketContext';
import '../styles/dashboard.css';

const Dashboard = ({ userId, logout }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [badges, setBadges] = useState([]);
  const [username, setUsername] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const socket = useSocket();

  const location = useLocation();

  useEffect(() => {
    if (!userId) return;

    fetchUserDashboard().then(data => {
      setCoinBalance(data.coinBalance || 0);
      setUsername(data.username || '');
    });

    fetchUserBadges().then(data => setBadges(data || []));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('userUpdate', data => {
      if (data.coinBalance !== undefined) setCoinBalance(data.coinBalance);
      setNotificationCount(c => c + 1);
    });

    socket.on('badgeEarned', ({ badge }) => {
      setBadges(prev => [...prev, badge]);
      setNotificationCount(c => c + 1);
    });

    return () => {
      socket.off('userUpdate');
      socket.off('badgeEarned');
    };
  }, [socket]);

  useEffect(() => {
    if (location.pathname === '/notifications') {
      setNotificationCount(0);
    }
  }, [location]);

  return (
    <div className="dashboard-container">
      <MenuBar username={username} onLogout={logout} notificationCount={notificationCount} />
      <Balance coinBalance={coinBalance} />
      <RewardNotifications />
      <TransactionHiFlow userId={userId} />
      <BadgeProgress badges={badges} />
      <Leaderboard currentUserId={userId} />
    </div>
  );
};

export default Dashboard;

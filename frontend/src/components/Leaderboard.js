import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/api';
import '../styles/Leaderboard.css';

const Leaderboard = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setUsers);
  }, []);

  return (
    <div className="leaderboard-container">
      <h3>Leaderboard</h3>
      <ol className="leaderboard-list">
        {users.length === 0 && <li>No users found.</li>}
        {users.map((user, index) => (
          <li
            key={user._id}
            className={`leaderboard-item ${
              currentUserId === user._id ? 'current-user' : ''
            }`}
          >
            <span className="rank">{index + 1}.</span>
            <span className="username">{user.username}</span>
            <span className="coins">{user.coinBalance} coins</span>
            <span className="badges-count">{user.badgesCount} badges</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;

import React from 'react';

const BadgeProgress = ({ badges = [] }) => (
  <div>
    <h3>Your Badges</h3>
    <ul>
      {badges.length === 0 && <li>No badges earned yet.</li>}
      {badges.map(({ badge, isEarned, progress, total }) => (
        <li key={badge._id} style={{ marginBottom: '16px' }}>
          <strong>{badge.name}</strong> - {badge.description}
          {isEarned ? (
            <span style={{ color: 'green', marginLeft: '10px' }}>(Earned)</span>
          ) : (
            <div style={{ marginTop: '5px', background: '#ddd', width: '200px', height: '10px', borderRadius: '4px' }}>
              <div
                style={{
                  width: `${(progress / total) * 100}%`,
                  height: '10px',
                  background: '#4caf50',
                  borderRadius: '4px',
                }}
              />
              <small>{progress} / {total}</small>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default BadgeProgress;

import React, { useState, useEffect } from 'react';
import '../styles/TransactionHiFlow.css';  // Import related styles
import { fetchUserTransactions } from '../api/api'; // Adjust import path if needed

const TransactionHiFlow = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetchUserTransactions(userId)
      .then((data) => setTransactions(data))
      .catch((err) => {
        console.error('Failed to fetch transactions:', err);
        setTransactions([]);
      });
  }, [userId]);

  return (
    <div className="transaction-hiflow-container">
      <h3>Transaction HiFlow</h3>
      <ul className="transaction-list">
        {transactions.length === 0 && <li>No transactions yet.</li>}
        {transactions.map(tx => (
          <li key={tx._id} className={`transaction-item ${tx.type}`}>
            <span className="amount">
              {tx.type === 'earning' ? '+' : '-'}
              {tx.amount} coins
            </span>{' '}
            <span className="description">— {tx.description}</span>{' '}
            <span className="date">({new Date(tx.date).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHiFlow;

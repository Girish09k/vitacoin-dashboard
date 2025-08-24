import React, { useEffect, useState } from 'react';
import { fetchUserTransactions } from '../api/api';
import '../styles/TransactionHiFlow.css';

const TransactionHiFlow = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!userId) return;
    
    fetchUserTransactions(userId)
      .then(setTransactions)
      .catch(() => setTransactions([]));
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

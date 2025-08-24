import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RewardNotifications = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('userUpdate', (data) => {
      let msg = `Balance updated: ${data.coinBalance} coins`;
      if (data.newTransaction) {
        msg += ` - ${data.newTransaction.description} (${data.newTransaction.type} ${data.newTransaction.amount})`;
      }
      toast.info(msg);
    });

    socket.on('badgeEarned', ({ badge }) => {
      toast.success(`Badge earned: ${badge.name}`);
    });

    return () => {
      socket.off('userUpdate');
      socket.off('badgeEarned');
    };
  }, [socket]);

  return <ToastContainer position="top-right" autoClose={5000} />;
};

export default RewardNotifications;

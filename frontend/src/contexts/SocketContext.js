import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io('http://localhost:5000');

    socketInstance.emit('subscribeToUser', userId);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

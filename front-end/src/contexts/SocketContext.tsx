"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SocketContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    // Implement socket connection logic
    setIsConnected(true);
  };

  const disconnect = () => {
    // Implement socket disconnection logic
    setIsConnected(false);
  };

  useEffect(() => {
    // Initialize socket connection
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

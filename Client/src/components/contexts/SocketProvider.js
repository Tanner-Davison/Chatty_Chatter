
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const PORT = process.env.REACT_APP_API_URL || 5000;

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
 

  useEffect(() => {
    // Initialize the socket only once
    const newSocket = io.connect(`/`, {
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

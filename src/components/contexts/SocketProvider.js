
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const PORT = process.env.PORT;

  useEffect(() => {
    // Initialize the socket only once
    const newSocket = io.connect(`${PORT}`, {
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

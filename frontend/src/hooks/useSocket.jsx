// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL||'http://localhost:5000'; // your backend socket URL

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    // Join both Ravi & Neha's personal rooms
    const defaultUsers = ["919937320320", "918329446654"];
    defaultUsers.forEach((id) => {
      socket.emit('join', id);
    });

    // Also join their conversation room (so they get messages instantly)
    socket.emit('join_conversation', {
      userWaId: "919937320320",
      contactWaId: "918329446654"
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}

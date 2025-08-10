import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(wa_id) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!wa_id) return;

    const socket = io('http://localhost:5000'); // Change to backend URL if deployed
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO:', socket.id);
      socket.emit('join', wa_id); // join room for this user
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO');
    });

    return () => {
      socket.disconnect();
    };
  }, [wa_id]);

  return socketRef.current;
}

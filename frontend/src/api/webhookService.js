import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
});

export const subscribeToWebhookEvents = (callback) => {
  socket.on('message:new', callback);
  socket.on('status:update', callback);
};

export default socket;

// server.js (or entrypoint)
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET','POST']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 New socket connected', socket.id);

  // Register user (optional) - easy for simulation/testing
  socket.on('register_user', (waId) => {
    if (!waId) return;
    socket.join(`user_${waId}`);
    console.log(`Socket ${socket.id} registered as user_${waId}`);
  });

  socket.on('join_conversation', (waId) => {
    if (!waId) return;
    socket.join(`conversation_${waId}`);
    console.log(`Socket ${socket.id} joined conversation_${waId}`);
  });

  socket.on('leave_conversation', (waId) => {
    if (!waId) return;
    socket.leave(`conversation_${waId}`);
    console.log(`Socket ${socket.id} left conversation_${waId}`);
  });

  // Client wants to send a message via socket
  socket.on('send_message', async (payload, ackCb) => {
    try {
      // Use your service to create and persist the message
      // import createMessageService from service at top-level or require here
      const { createMessageService } = await import('./src/services/messageService.js');
      const saved = await createMessageService(payload);

      // Emit to the conversation room (so viewers see it)
      const room = `conversation_${saved.wa_id}`;
      io.to(room).emit('new_message', saved);

      // Also emit a conversation-list update to all (or specific admin)
      io.emit('conversation_updated', { wa_id: saved.wa_id, last_message: saved.text, last_timestamp: saved.timestamp });

      // Ack back to sender with saved doc (optional)
      if (typeof ackCb === 'function') ackCb({ success: true, message: saved });
    } catch (err) {
      console.error('Error handling send_message', err);
      if (typeof ackCb === 'function') ackCb({ success: false, error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

// src/server.js
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './src/config/db.js';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware: make io available in routes/controllers
app.set('io', io);

// Listen for Socket.IO connections
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

//start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

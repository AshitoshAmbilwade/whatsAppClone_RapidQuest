// socketClient.js
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

socket.on('connect', () => console.log('connected', socket.id));
socket.on('new_message', (m) => console.log('new_message', m));
socket.on('message_status_update', (m) => console.log('status_update', m));
socket.on('disconnect', () => console.log('disconnected'));

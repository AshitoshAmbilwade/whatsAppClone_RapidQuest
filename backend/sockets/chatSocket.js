// backend/sockets/chatSocket.js
export default function chatSocket(io, socket) {
  // Personal room join
  socket.on('join', (wa_id) => {
    if (!wa_id) return;
    socket.join(wa_id);
    console.log(`📌 ${wa_id} joined their personal room`);
  });

  // Join conversation room
  socket.on('join_conversation', ({ userWaId, contactWaId }) => {
    if (!userWaId || !contactWaId) return;
    const roomId = [userWaId, contactWaId].sort().join('-');
    socket.join(roomId);
    console.log(`📌 ${userWaId} joined conversation room ${roomId}`);
  });

  // Send message to conversation room
  socket.on('send_message', (msg) => {
    if (!msg?.sender_wa_id || !msg?.receiver_wa_id) return;
    const roomId = [msg.sender_wa_id, msg.receiver_wa_id].sort().join('-');
    io.to(roomId).emit('new_message', msg);
  });

  // Status updates
  socket.on('update_status', (statusData) => {
    if (!statusData?.sender_wa_id || !statusData?.receiver_wa_id) return;
    const roomId = [statusData.sender_wa_id, statusData.receiver_wa_id].sort().join('-');
    io.to(roomId).emit('status_updated', statusData);
  });
}

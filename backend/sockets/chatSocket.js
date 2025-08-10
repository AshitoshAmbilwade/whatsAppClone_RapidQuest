export default function chatSocket(io, socket) {
  // User joins their personal room
  socket.on('join', (wa_id) => {
    socket.join(wa_id);
    console.log(`📌 ${wa_id} joined their personal room`);
  });

  // User joins a specific conversation room
  socket.on('join_conversation', ({ userWaId, contactWaId }) => {
    const roomId = [userWaId, contactWaId].sort().join('-'); // unique conversation id
    socket.join(roomId);
    console.log(`📌 ${userWaId} joined conversation room ${roomId}`);
  });

  // Send message
  socket.on('send_message', (msg) => {
    if (!msg.sender_wa_id || !msg.receiver_wa_id) return;

    const roomId = [msg.sender_wa_id, msg.receiver_wa_id].sort().join('-');

    // Emit to conversation room (both sides)
    io.to(roomId).emit('new_message', msg);
  });

  // Status updates
  socket.on('update_status', (statusData) => {
    const roomId = [statusData.sender_wa_id, statusData.receiver_wa_id].sort().join('-');
    io.to(roomId).emit('status_updated', statusData);
  });
}

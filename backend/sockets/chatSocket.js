// backend/sockets/chatSocket.js

export default function chatSocket(io, socket) {
    console.log(`✅ Chat socket initialized for ${socket.id}`);

    // Listen for when a user joins with their wa_id (simulated login)
    socket.on('join', (wa_id) => {
        socket.join(wa_id); // Join a room named after wa_id
        console.log(`📌 User with wa_id ${wa_id} joined room`);
    });

    // Listen for sending message from client
    socket.on('send_message', (messageData) => {
        console.log(`💬 New message from ${messageData.sender_wa_id} to ${messageData.receiver_wa_id}`);

        // Emit to receiver's room
        io.to(messageData.receiver_wa_id).emit('new_message', messageData);

        // Emit back to sender's room to confirm
        io.to(messageData.sender_wa_id).emit('message_sent', messageData);
    });

    // Listen for status updates (e.g., read receipts)
    socket.on('update_status', (statusData) => {
        console.log(`📨 Status update: ${statusData.message_id} → ${statusData.status}`);

        // Notify the sender about the status update
        io.to(statusData.sender_wa_id).emit('status_updated', statusData);
    });
}

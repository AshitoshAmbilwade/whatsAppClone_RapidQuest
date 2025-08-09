io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  // Join room for a given conversation
  socket.on("join_conversation", (wa_id) => {
    socket.join(wa_id);
    console.log(`📥 Socket ${socket.id} joined room ${wa_id}`);
  });

  // Leave room
  socket.on("leave_conversation", (wa_id) => {
    socket.leave(wa_id);
    console.log(`📤 Socket ${socket.id} left room ${wa_id}`);
  });

  // When a user sends a message
  socket.on("send_message", (msg) => {
    // ✅ Save message to DB here if needed
    // ✅ Broadcast to all users in the room
    io.to(msg.wa_id).emit("new_message", msg);

    // 🔔 Send notification to the *other* user
    socket.to(msg.wa_id).emit("notification", {
      text: `New message from ${msg.name}`,
      wa_id: msg.wa_id,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

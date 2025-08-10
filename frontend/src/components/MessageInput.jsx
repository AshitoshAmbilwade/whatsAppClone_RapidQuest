import React, { useState } from 'react';
import { sendMessage } from '../api/messages.js';
import { useUser } from '../context/UserContext.jsx';

export default function MessageInput({ contactWaId, socket, onMessageSent }) {
  const [text, setText] = useState('');
  const { user } = useUser();

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user?.wa_id) return;

    const newMessage = {
      wa_id: contactWaId, // legacy contact id
      name: null,
      message_id: `local-${Date.now()}`,
      type: 'text',
      text: trimmed,
      timestamp: new Date(),
      status: 'sent',
      direction: 'outgoing',
      sender_wa_id: user.wa_id,
      receiver_wa_id: contactWaId
    };

    // Optimistic UI update
    onMessageSent(newMessage);

    // Emit to socket for real-time sync
    socket?.emit('send_message', newMessage);

    // Persist to backend
    try {
      await sendMessage(newMessage);
    } catch (err) {
      console.error('❌ Failed to send message to backend:', err);
    }

    setText('');
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center p-3 border-t bg-white gap-2"
    >
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none bg-gray-100"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
          }
        }}
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium"
      >
        Send
      </button>
    </form>
  );
}

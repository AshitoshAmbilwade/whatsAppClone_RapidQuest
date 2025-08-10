import React, { useState } from 'react';
import { sendMessage } from '../api/messages.js';

export default function MessageInput({ socket, onMessageSent }) {
  const [text, setText] = useState('');

  // Fixed participants
  const SENDER_ID = '919937320320';   // Ravi
  const RECEIVER_ID = '918329446654'; // Neha

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessage = {
      wa_id: RECEIVER_ID, // legacy contact id
      name: 'Ravi Kumar', // sender name
      message_id: `local-${Date.now()}`,
      type: 'text',
      text: trimmed,
      timestamp: new Date(),
      status: 'sent',
      direction: 'outgoing',
      sender_wa_id: SENDER_ID,
      receiver_wa_id: RECEIVER_ID
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

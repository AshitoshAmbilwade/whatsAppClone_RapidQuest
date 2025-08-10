// src/components/ChatWindow.jsx
import React, { useEffect, useState } from 'react';
import { getMessagesByWaId } from '../api/messages.js';
import { useUser } from '../context/UserContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import Header from './Header.jsx';

export default function ChatWindow({ contactWaId, socket }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!contactWaId || !user) return;

    getMessagesByWaId(contactWaId, user.wa_id).then((data) => {
      if (data.success) {
        setMessages(data.messages);
      }
    });
  }, [contactWaId, user]);

  // Real-time message handling
  useEffect(() => {
    if (!socket || !user) return;

    const handleIncoming = (msg) => {
      // Check if message is between the selected contact & the logged-in user
      const isRelevant =
        (msg.sender_wa_id === contactWaId && msg.receiver_wa_id === user.wa_id) ||
        (msg.sender_wa_id === user.wa_id && msg.receiver_wa_id === contactWaId);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('new_message', handleIncoming);
    socket.on('message_sent', handleIncoming);

    socket.on('status_updated', (statusData) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === statusData.message_id
            ? { ...m, status: statusData.status }
            : m
        )
      );
    });

    return () => {
      socket.off('new_message', handleIncoming);
      socket.off('message_sent', handleIncoming);
      socket.off('status_updated');
    };
  }, [socket, contactWaId, user]);

  return (
    <div className="flex flex-col flex-1">
      {/* Chat header with name or number */}
      <Header
        contactName={messages[0]?.name || contactWaId}
        contactNumber={contactWaId}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.message_id}
            message={msg}
            isOwn={msg.sender_wa_id === user?.wa_id}
          />
        ))}
      </div>

      {/* Input */}
      <MessageInput
        contactWaId={contactWaId}
        socket={socket}
        onMessageSent={(msg) =>
          setMessages((prev) => [...prev, { ...msg, sender_wa_id: user.wa_id }])
        }
      />
    </div>
  );
}

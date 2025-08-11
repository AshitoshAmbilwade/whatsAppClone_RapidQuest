// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagesByWaId } from '../api/messages.js';
import { getConversations } from '../api/conversations.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import Header from './Header.jsx';

export default function ChatWindow({ contactWaId, socket, currentUser }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [contactName, setContactName] = useState(contactWaId);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goBack = () => navigate('/chats');

  // 🔹 Fetch contact name from conversations list
  useEffect(() => {
  if (!contactWaId) return;

  getConversations().then((data) => {
    if (data.success && Array.isArray(data.conversations)) {
      // ✅ Match conversation by wa_id
      const convo = data.conversations.find(
        (c) => c.wa_id === contactWaId
      );

      // ✅ Prefer name if available, else fallback to WA ID
      setContactName(convo?.name || contactWaId);
    } else {
      setContactName(contactWaId);
    }
  }).catch(() => {
    setContactName(contactWaId);
  });
}, [contactWaId]);

  // Fetch messages for the conversation
  useEffect(() => {
    if (!contactWaId || !currentUser?.wa_id) return;
    getMessagesByWaId(contactWaId, currentUser.wa_id).then((data) => {
      if (data.success) {
        setMessages(data.messages);
      }
    });
  }, [contactWaId, currentUser?.wa_id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle incoming socket events
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleIncoming = (msg) => {
      const isRelevant =
        (msg.sender_wa_id === contactWaId && msg.receiver_wa_id === currentUser.wa_id) ||
        (msg.sender_wa_id === currentUser.wa_id && msg.receiver_wa_id === contactWaId);

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
  }, [socket, contactWaId, currentUser]);

  return (
    <div className="flex flex-col w-full h-full">
      <Header
        contactName={currentUser.name}
        contactNumber={contactWaId}
        onBack={isMobile ? goBack : null}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.message_id}
              message={msg}
              isOwn={msg.sender_wa_id === currentUser.wa_id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="pb-2 md:pb-4 bg-white">
        <div className="max-w-4xl mx-auto w-full px-2 md:px-0">
          <MessageInput
            contactWaId={contactWaId}
            socket={socket}
            currentUser={currentUser}
            onMessageSent={(msg) =>
              setMessages((prev) => [
                ...prev,
                { ...msg, sender_wa_id: currentUser.wa_id }
              ])
            }
          />
        </div>
      </div>
    </div>
  );
}

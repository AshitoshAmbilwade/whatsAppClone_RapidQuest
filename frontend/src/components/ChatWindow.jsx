// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagesByWaId } from '../api/messages.js';
import { useUser } from '../context/UserContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import Header from './Header.jsx';

export default function ChatWindow({ contactWaId, socket }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle back button (for mobile view)
  const goBack = () => {
    navigate('/chats');
  };

  // Fetch messages when chat changes
  useEffect(() => {
    if (!contactWaId || !user) return;

    getMessagesByWaId(contactWaId, user.wa_id).then((data) => {
      if (data.success) {
        setMessages(data.messages);
      }
    });
  }, [contactWaId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time message handling
  useEffect(() => {
    if (!socket || !user) return;

    const handleIncoming = (msg) => {
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
    <div className="flex flex-col w-full h-full">
      {/* Header with back button for mobile */}
      <Header 
        contactName={messages[0]?.name || contactWaId}
        contactNumber={contactWaId}
        onBack={isMobile ? goBack : null}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.message_id}
              message={msg}
              isOwn={msg.sender_wa_id === user?.wa_id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="pb-2 md:pb-4 bg-white">
        <div className="max-w-4xl mx-auto w-full px-2 md:px-0">
          <MessageInput
            contactWaId={contactWaId}
            socket={socket}
            onMessageSent={(msg) =>
              setMessages((prev) => [...prev, { ...msg, sender_wa_id: user.wa_id }])
            }
          />
        </div>
      </div>
    </div>
  );
}
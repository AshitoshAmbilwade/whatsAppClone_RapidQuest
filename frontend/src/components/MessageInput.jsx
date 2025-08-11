// src/components/MessageInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/messages.js';

export default function MessageInput({ contactWaId, socket, onMessageSent, currentUser }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  // Typing indicator
  useEffect(() => {
    if (!socket || !currentUser?.wa_id || !contactWaId) return;

    const emitTyping = () => {
      socket.emit('typing', {
        sender: currentUser.wa_id,
        receiver: contactWaId,
        isTyping: true
      });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        socket.emit('typing', {
          sender: currentUser.wa_id,
          receiver: contactWaId,
          isTyping: false
        });
        setIsTyping(false);
      }, 2000);
    };

    if (text.trim()) {
      setIsTyping(true);
      emitTyping();
    } else {
      setIsTyping(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [text, contactWaId, socket, currentUser]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !currentUser?.wa_id) return;

    const newMessage = {
      wa_id: contactWaId,
      name: currentUser.name,
      message_id: `local-${Date.now()}`,
      type: 'text',
      text: trimmed,
      timestamp: new Date(),
      status: 'sent',
      direction: 'outgoing',
      sender_wa_id: currentUser.wa_id,
      receiver_wa_id: contactWaId
    };

    onMessageSent(newMessage);
    socket?.emit('send_message', newMessage);

    try {
      await sendMessage(newMessage);
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }

    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full">
      {isTyping && (
        <div className="px-4 py-1 bg-gray-100 text-sm text-gray-500 italic">
          Typing...
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-end p-2 md:p-3 border-t bg-white gap-2"
      >
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Attach file"
        >
          📎
        </button>

        {/* Emoji button */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Add emoji"
        >
          😀
        </button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          className="flex-1 border rounded-2xl px-4 py-2 text-base focus:outline-none bg-gray-100 resize-none max-h-32"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className={`p-2 rounded-full focus:outline-none ${
            text.trim()
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'text-gray-400'
          }`}
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

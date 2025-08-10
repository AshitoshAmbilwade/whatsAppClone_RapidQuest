import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/messages.js';
import { useUser } from '../context/UserContext.jsx';

export default function MessageInput({ contactWaId, socket, onMessageSent }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);
  const { user } = useUser();

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [text]);

  // Handle typing indicators
  useEffect(() => {
    if (!socket || !user || !contactWaId) return;

    const handleTyping = () => {
      socket.emit('typing', {
        sender: user.wa_id,
        receiver: contactWaId,
        isTyping: true
      });
      
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing', {
          sender: user.wa_id,
          receiver: contactWaId,
          isTyping: false
        });
        setIsTyping(false);
      }, 2000);
    };

    if (text.trim().length > 0) {
      setIsTyping(true);
      handleTyping();
    } else {
      setIsTyping(false);
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    }

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [text, contactWaId, socket, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user?.wa_id) return;

    const newMessage = {
      wa_id: contactWaId,
      name: user.name,
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full">
      {/* Typing indicator */}
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
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Attach file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Emoji button */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Add emoji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Text input */}
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
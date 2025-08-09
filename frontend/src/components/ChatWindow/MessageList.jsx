// src/components/ChatWindow/MessageList.jsx
import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages = [] }) {
  const bottomRef = useRef();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!Array.isArray(messages)) {
    return <div className="p-4 text-gray-500">No messages</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.message_id || msg.id} {...msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

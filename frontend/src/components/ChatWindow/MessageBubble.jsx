// src/components/ChatWindow/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ text, sender, timestamp }) {
  const isMe = sender === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs break-words ${
          isMe
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        <div>{text}</div>
        {timestamp && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function MessageBubble({ text, sender }) {
  const isMe = sender === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-2 rounded-lg max-w-xs ${
          isMe ? "bg-green-200" : "bg-white border"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

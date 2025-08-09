import React from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList() {
  const messages = [
    { id: 1, text: "Hello!", sender: "me" },
    { id: 2, text: "Hey! How are you?", sender: "other" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}
    </div>
  );
}

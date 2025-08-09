import React from "react";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
  // For now, mock data
  const conversations = [
    { id: 1, name: "John Doe", lastMessage: "Hello!", time: "12:30 PM" },
    { id: 2, name: "Jane Smith", lastMessage: "How are you?", time: "11:15 AM" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem key={conv.id} {...conv} />
      ))}
    </div>
  );
}

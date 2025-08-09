// src/components/ChatWindow/ChatWindow.jsx
import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ selectedConversation, messages, onSendMessage, onBack }) {
  if (!selectedConversation) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ChatHeader name={selectedConversation.name} onBack={onBack} />
      <MessageList messages={messages} />
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}

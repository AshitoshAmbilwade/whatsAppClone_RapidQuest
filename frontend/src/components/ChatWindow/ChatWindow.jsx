import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
}

import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/ChatWindow/ChatWindow";

export default function Dashboard() {
  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-full sm:w-1/3 md:w-1/4 border-r border-gray-300">
        <Sidebar />
      </div>

      {/* Chat Window */}
      <div className="hidden sm:flex flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}

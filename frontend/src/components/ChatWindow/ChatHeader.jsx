// src/components/ChatWindow/ChatHeader.jsx
import React from "react";

export default function ChatHeader({ name, onBack }) {
  return (
    <div className="flex items-center p-3 bg-gray-100 border-b">
      {/* Mobile back button */}
      <button
        className="md:hidden mr-3 text-gray-600"
        onClick={onBack}
      >
        ←
      </button>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
        <span className="font-semibold">
          {(name || "").slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{name || "Unknown"}</span>
        <span className="text-xs text-gray-500">Online</span>
      </div>
    </div>
  );
}

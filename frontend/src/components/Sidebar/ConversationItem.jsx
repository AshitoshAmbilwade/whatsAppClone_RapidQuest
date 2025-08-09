// src/components/Sidebar/ConversationItem.jsx
import React from "react";

export default function ConversationItem({ conversation, active, onSelect }) {
  const { _id: wa_id, name, last_message, last_timestamp, unread_count } = conversation;

  const handleClick = () => {
    if (typeof onSelect === "function") {
      onSelect(wa_id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center p-3 gap-3 cursor-pointer hover:bg-gray-100 ${
        active ? "bg-gray-200" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="font-semibold text-sm">
          {(name || wa_id || "").slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="truncate font-medium">{name || wa_id}</div>
          <div className="text-xs text-gray-500">
            {last_timestamp ? new Date(last_timestamp).toLocaleString() : ""}
          </div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="truncate text-sm text-gray-600">{last_message || ""}</div>
          {unread_count > 0 && (
            <div className="ml-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
              {unread_count}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

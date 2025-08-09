// src/components/Sidebar/Sidebar.jsx
import React from "react";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";

export default function Sidebar({ conversations, selectedWaId, onSelectConversation, onSearch }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <SearchBar onSearch={onSearch} />
      <ConversationList
        conversations={conversations}
        selectedWaId={selectedWaId}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
}

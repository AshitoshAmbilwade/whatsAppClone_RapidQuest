import React from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-white">
      <SidebarHeader />
      <SearchBar />
      <ConversationList />
    </div>
  );
}

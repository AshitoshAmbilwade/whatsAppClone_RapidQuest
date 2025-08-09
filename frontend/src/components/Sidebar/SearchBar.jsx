import React from "react";

export default function SearchBar() {
  return (
    <div className="p-3 bg-gray-100 border-b">
      <input
        type="text"
        placeholder="Search or start new chat"
        className="w-full p-2 rounded-full border border-gray-300 focus:outline-none"
      />
    </div>
  );
}

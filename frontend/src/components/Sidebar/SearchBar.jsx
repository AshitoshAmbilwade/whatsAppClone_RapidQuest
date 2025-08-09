import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <div className="p-3 bg-gray-100 border-b flex gap-2 items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search or start new chat"
        className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none"
      />
      {/* Filter Button (we can hook a dropdown later) */}
      <button
        className="px-3 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
        title="Filter options"
      >
        ⚙
      </button>
    </div>
  );
}

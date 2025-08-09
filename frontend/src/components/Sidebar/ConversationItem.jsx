import React from "react";

export default function ConversationItem({ name, lastMessage, time }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b">
      <div className="flex items-center gap-3">
        <img
          src="https://imgs.search.brave.com/O9pF85gxQOywJcgAaeO23ZZ9rurhMIBJnRcGl4Ke_AI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wb3J0/cmFpdC15b3VuZy1o/YW5kc29tZS1tYW4t/d2hpdGUtc2hpcnQt/b3V0ZG9vci1uaWNl/LWFwcGVhcmFuY2Ut/c3R5bGlzaC1oYWly/LWJlYXJkLWxlYW5p/bmctc2lkZS13YWxs/LTEzMTkyODgwMy5q/cGc"
          alt={name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
}

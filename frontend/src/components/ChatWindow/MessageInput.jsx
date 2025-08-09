import React, { useState } from "react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Send:", message);
    setMessage("");
  };

  return (
    <form
      onSubmit={sendMessage}
      className="p-3 flex items-center gap-2 border-t bg-gray-100"
    >
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
      >
        ➤
      </button>
    </form>
  );
}

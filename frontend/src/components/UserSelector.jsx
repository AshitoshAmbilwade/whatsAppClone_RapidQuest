import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const users = [
  { name: "Ravi Kumar", wa_id: "919937320320" },
  { name: "Neha Joshi", wa_id: "918329446654" },
];

export default function UserSelector() {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSelect = (u) => {
    login(u);
    navigate("/chats"); // go to conversation list, not your own id
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Who are you?</h1>
        <div className="space-y-3">
          {users.map((u) => (
            <button
              key={u.wa_id}
              onClick={() => handleSelect(u)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

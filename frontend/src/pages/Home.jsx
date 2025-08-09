import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Clone</h1>

      <button
        onClick={() => navigate("/login")}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
      >
        Login
      </button>

      <button
        onClick={() => navigate("/register")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        Register
      </button>
    </div>
  );
};

export default Home;

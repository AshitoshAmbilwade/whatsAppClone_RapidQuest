import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authService";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext"; // optional

export default function Login() {
  const auth = useContext(AuthContext) || {};
  const { login } = auth;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await loginUser(username, password);

      if (login) {
        login(userData);
      } else {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      toast.success("Login successful — redirecting...", { autoClose: 900 });
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <input type="text" placeholder="Username" className="border p-2 w-full mb-4 rounded"
               value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full">
          Login
        </button>
        <p className="text-blue-500 mt-3 text-center cursor-pointer" onClick={() => navigate("/register")}>
          Create an account
        </p>
      </form>
    </div>
  );
}

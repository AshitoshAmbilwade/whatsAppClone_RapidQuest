import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // Or use AuthContext
  return token ? children : <Navigate to="/login" replace />;
}

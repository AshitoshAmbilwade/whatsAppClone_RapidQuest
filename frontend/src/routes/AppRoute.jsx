import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Protected Dashboard */}
      <Route
        path="/"
        element={
          
            <Dashboard />
          
        }
      />
         </Routes>
    </Router>
  );
}

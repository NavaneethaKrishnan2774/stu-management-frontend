import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// import modules
import Academic from "./pages/Academic";
import Administrative from "./pages/Administrative";
import Development from "./pages/Development";
import Communication from "./pages/Communication";
import Analytics from "./pages/Analytics";
import Navigation from "./pages/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboards */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />

        {/* ✅ ADD MODULE ROUTES HERE */}
        <Route path="/academics" element={<Academic />} />
        <Route path="/administration" element={<Administrative />} />
        <Route path="/development" element={<Development />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/navigation" element={<Navigation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
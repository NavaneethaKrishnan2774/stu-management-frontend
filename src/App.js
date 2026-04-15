import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import StaffRoleSelection from "./pages/StaffRoleSelection";
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";
import HODLogin from "./pages/HODLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import HODDashboard from "./pages/HODDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import FeedbackComments from "./pages/FeedbackComments";

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
        {/* Role selection landing page */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />

        {/* Student routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Staff routes */}
        <Route path="/staff/roles" element={<StaffRoleSelection />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/register" element={<StaffRegister />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/hod/login" element={<HODLogin />} />
        <Route path="/hod/dashboard" element={<HODDashboard />} />
        <Route path="/staff/comments/:category" element={<FeedbackComments />} />
        <Route path="/hod/comments/:category" element={<FeedbackComments />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

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
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import StaffRoleSelection from "./pages/StaffRoleSelection";
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";
import StaffRegistrationStatus from "./pages/StaffRegistrationStatus";
import HODLogin from "./pages/HODLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import HODDashboard from "./pages/HODDashboard";
import HODStudents from "./pages/HODStudents";
import HODStaff from "./pages/HODStaff";
import HODLowAttendance from "./pages/HODLowAttendance";
import HODNotifications from "./pages/HODNotifications";
import HODAnalytics from "./pages/HODAnalytics";
import HODTimetable from "./pages/HODTimetable";
import HODPlacementDrives from "./pages/HODPlacementDrives";
import HODRoute from "./components/HODRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminStaffRegistrations from "./pages/AdminStaffRegistrations";
import FeedbackComments from "./pages/FeedbackComments";

// Placement Officer imports
import PlacementOfficerDashboard from "./pages/PlacementOfficerDashboard";
import PlacementStudents from "./pages/PlacementStudents";
import PlacementCreateDrive from "./pages/PlacementCreateDrive";
import PlacementDrives from "./pages/PlacementDrives";
import PlacementOfficerRoute from "./components/PlacementOfficerRoute";

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
        <Route path="/staff/register/status" element={<StaffRegistrationStatus />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/hod/login" element={<HODLogin />} />
        <Route path="/hod/dashboard" element={<HODRoute><HODDashboard /></HODRoute>} />
        <Route path="/hod/students" element={<HODRoute><HODStudents /></HODRoute>} />
        <Route path="/hod/staff" element={<HODRoute><HODStaff /></HODRoute>} />
        <Route path="/hod/low-attendance" element={<HODRoute><HODLowAttendance /></HODRoute>} />
        <Route path="/hod/notifications" element={<HODRoute><HODNotifications /></HODRoute>} />
        <Route path="/hod/analytics" element={<HODRoute><HODAnalytics /></HODRoute>} />
        <Route path="/hod/timetables" element={<HODRoute><HODTimetable /></HODRoute>} />
        <Route path="/hod/placement-drives" element={<HODRoute><HODPlacementDrives /></HODRoute>} />
        <Route path="/staff/comments/:category" element={<FeedbackComments />} />
        <Route path="/hod/comments/:category" element={<HODRoute><FeedbackComments /></HODRoute>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff-registrations" element={<AdminStaffRegistrations />} />

        {/* Placement Officer routes */}
        <Route path="/placement/dashboard" element={<PlacementOfficerRoute><PlacementOfficerDashboard /></PlacementOfficerRoute>} />
        <Route path="/placement/students/:department" element={<PlacementOfficerRoute><PlacementStudents /></PlacementOfficerRoute>} />
        <Route path="/placement/create-drive" element={<PlacementOfficerRoute><PlacementCreateDrive /></PlacementOfficerRoute>} />
        <Route path="/placement/drives" element={<PlacementOfficerRoute><PlacementDrives /></PlacementOfficerRoute>} />

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
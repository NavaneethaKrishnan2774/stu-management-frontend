import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";

const designationLabels = {
  staff: "Staff",
  hod: "HOD",
  faculty_fa: "Faculty (FA)",
  faculty_subject: "Faculty (Subject Holder)",
  librarian: "Librarian",
  placement_officer: "Placement Officer",
  association_advisor: "Association Advisor",
  hostel_warden: "Hostel Warden",
};

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultDesignation = queryParams.get("designation") || "staff";
  const [designation] = useState(defaultDesignation);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await API.post("api/login/", {
        username,
        password,
        designation,
      });

      const { access, role, department, year, section } = res;
      if (!access) {
        alert("Invalid login");
        return;
      }

      localStorage.setItem("token", access);
      localStorage.setItem("role", role);
      localStorage.setItem("designation", designation);
      localStorage.setItem("department", department);
      localStorage.setItem("year", year);
      localStorage.setItem("section", section);

      if (role === "staff") {
        if (designation === "faculty_fa" || designation === "faculty_subject") {
          navigate("/staff/dashboard");
        } else {
          alert("Only faculty members can access the staff dashboard. Please choose Faculty (FA) or Faculty (Subject Holder).");
          navigate("/staff/roles");
        }
      } else if (role === "hod") navigate("/hod/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Login failed or designation mismatch");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "420px", margin: "auto" }}>
      <h2>Staff Login</h2>
      <p>Enter your username, password and designation.</p>

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Username</label>
      <input
        style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Designation</label>
      <input
        type="text"
        readOnly
        style={{ width: "100%", padding: "10px", marginBottom: "12px", backgroundColor: "#f9f9f9" }}
        value={designationLabels[designation] || designation}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Password</label>
      <input
        style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        style={{ padding: "10px 18px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Login
      </button>

      <div style={{ marginTop: "18px" }}>
        <Link to="/" style={{ color: "#1976d2" }}>
          Back to main login
        </Link>
      </div>

      <div style={{ marginTop: "16px" }}>
        <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" style={{ color: "#1976d2" }}>
          Go to Django Admin
        </a>
      </div>
    </div>
  );
}

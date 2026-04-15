import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function HODLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("hod");
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
      localStorage.setItem("department", department);
      localStorage.setItem("year", year);
      localStorage.setItem("section", section);

      if (role === "hod") navigate("/hod/dashboard");
      else if (role === "staff") navigate("/staff/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Login failed or designation mismatch");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "420px", margin: "auto" }}>
      <h2>HOD Login</h2>
      <p>Enter your username, password and designation.</p>

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Username</label>
      <input
        style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Designation</label>
      <select
        style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      >
        <option value="hod">HOD</option>
        <option value="staff">Staff</option>
      </select>

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

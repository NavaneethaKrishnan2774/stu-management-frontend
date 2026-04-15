import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function StudentLogin() {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("api/login/", {
        username: registerNumber,
        password,
        designation: "student",
      });

      const { access, role, department, year, section } = res;
      if (!access) {
        alert("Invalid login. Please check your register number and password.");
        return;
      }

      localStorage.setItem("token", access);
      localStorage.setItem("role", role);
      localStorage.setItem("department", department);
      localStorage.setItem("year", year);
      localStorage.setItem("section", section);

      navigate("/student/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again or reset your password.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "520px", margin: "auto" }}>
      <h2>Student Login</h2>
      <p>Use your student register number and password to login.</p>

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Register Number</label>
      <input
        style={{ width: "100%", padding: "10px", marginBottom: "14px" }}
        placeholder="Enter your register number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Password</label>
      <input
        type="password"
        style={{ width: "100%", padding: "10px", marginBottom: "14px" }}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "12px 18px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
        <Link to="/student/register" style={{ color: "#1976d2" }}>
          New student? Register here
        </Link>
        <button
          type="button"
          onClick={() => alert("Forgot password: OTP via registered email will be sent.")}
          style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", padding: 0 }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

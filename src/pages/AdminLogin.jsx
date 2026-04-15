import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("api/login/", {
        username: mobile,
        password,
        designation: "admin",
      });

      const { access, role } = res;
      if (!access) {
        alert("Invalid login. Please verify your mobile number and password.");
        return;
      }

      localStorage.setItem("token", access);
      localStorage.setItem("role", role);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "520px", margin: "auto" }}>
      <h2>Admin Login</h2>
      <p>Login using your registered mobile number and password.</p>

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Mobile Number</label>
      <input
        style={{ width: "100%", padding: "10px", marginBottom: "14px" }}
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Password</label>
      <input
        type="password"
        style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
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
        <Link to="/admin/register" style={{ color: "#1976d2" }}>
          New admin? Register here
        </Link>
        <button
          type="button"
          onClick={() => alert("Forgot password: OTP will be sent to the registered email.")}
          style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", padding: 0 }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("staff");
  const navigate = useNavigate();

  const handleLogin = async () => {
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

      if (role === "student") navigate("/student/dashboard");
      else if (role === "staff") navigate("/staff/dashboard");
      else if (role === "hod") navigate("/hod/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/");

    } catch (err) {
      console.error(err);
      alert("Invalid login or designation mismatch");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "420px", margin: "auto" }}>
      <h2>Login</h2>
      <p>Select your designation and login to continue.</p>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Username</label>
        <input
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Designation</label>
        <select
          style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        >
          <option value="staff">Staff</option>
          <option value="hod">HOD</option>
          <option value="admin">Admin</option>
        </select>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Password</label>
        <input
          style={{ width: "100%", padding: "10px", marginBottom: "16px" }}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{ padding: "10px 18px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Login
      </button>

      <div style={{ marginTop: "24px" }}>
        <p>Or use dedicated login pages:</p>
        <Link to="/staff/login" style={{ display: "inline-block", marginRight: "12px", color: "#1976d2" }}>
          Staff Login
        </Link>
        <Link to="/hod/login" style={{ display: "inline-block", color: "#1976d2" }}>
          HOD Login
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

export default Login;
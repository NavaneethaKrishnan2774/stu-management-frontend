import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // ✅ FIXED ENDPOINT HERE
      const res = await API.post("api/login/", {
        username: username,
        password: password,
      });

      console.log("LOGIN RESPONSE:", res);

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
      else if (role === "admin") navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid login");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
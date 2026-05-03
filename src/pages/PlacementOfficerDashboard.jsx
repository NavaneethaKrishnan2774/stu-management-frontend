import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlacementOfficerDashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const designation = localStorage.getItem("designation");

    if (!token) {
      navigate("/staff/login");
      return;
    }

    if (role !== "staff" || designation !== "placement_officer") {
      navigate("/staff/login");
      return;
    }

    setUserInfo({
      role,
      designation,
      department: localStorage.getItem("department"),
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("designation");
    localStorage.removeItem("department");
    localStorage.removeItem("year");
    localStorage.removeItem("section");
    navigate("/staff/login");
  };

  const menuItems = [
    {
      title: "Placement Drives",
      description: "View and manage placement drives",
      icon: "📋",
      color: "#e3f2fd",
      borderColor: "#2196f3",
      action: () => navigate("/placement/drives"),
    },
    {
      title: "Create Drive",
      description: "Create a new placement drive",
      icon: "➕",
      color: "#f3e5f5",
      borderColor: "#9c27b0",
      action: () => navigate("/placement/create-drive"),
    },
    {
      title: "Companies",
      description: "Manage company information",
      icon: "🏢",
      color: "#fff3e0",
      borderColor: "#ff9800",
      action: () => alert("Coming soon"),
    },
    {
      title: "Student Statistics",
      description: "View placement statistics",
      icon: "📊",
      color: "#e8f5e9",
      borderColor: "#4caf50",
      action: () => alert("Coming soon"),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ marginBottom: "8px" }}>Placement Officer Dashboard</h1>
          {userInfo && <p style={{ color: "#666" }}>Department: {userInfo.department}</p>}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            style={{
              padding: "24px",
              backgroundColor: item.color,
              border: `2px solid ${item.borderColor}`,
              borderRadius: "12px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
            <h3 style={{ margin: "12px 0", color: "#333" }}>{item.title}</h3>
            <p style={{ color: "#666", fontSize: "14px" }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
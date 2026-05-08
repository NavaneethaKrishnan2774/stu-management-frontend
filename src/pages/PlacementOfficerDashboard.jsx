import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PlacementOfficerDashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [driveCount, setDriveCount] = useState(0);
  const [driveError, setDriveError] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    API.get("api/students/placement/drives/", null, token)
      .then((data) => {
        if (Array.isArray(data)) {
          setDriveCount(data.length);
        } else {
          setDriveError("Unexpected server response for placement drives.");
        }
      })
      .catch((err) => {
        console.error(err);
        setDriveError("Unable to fetch drive summary.");
      });
  }, []);

  const menuItems = [
    {
      title: "Placement Drives",
      description: "View and manage placement drives with filters",
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
      action: () => navigate("/placement/companies"),
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "#e3f2fd", border: "1px solid #90caf9", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "14px", color: "#0d47a1", marginBottom: "10px", fontWeight: 700 }}>Active Drives</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#0d47a1" }}>{driveCount}</div>
          <div style={{ marginTop: "8px", color: "#37474f", fontSize: "13px" }}>Drives created by you</div>
        </div>
        <div style={{ backgroundColor: "#e8f5e9", border: "1px solid #81c784", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "14px", color: "#2e7d32", marginBottom: "10px", fontWeight: 700 }}>Placement Tools</div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#2e7d32" }}>Ready</div>
          <div style={{ marginTop: "8px", color: "#37474f", fontSize: "13px" }}>Manage drives and student placements</div>
        </div>
        <div style={{ backgroundColor: "#fff3e0", border: "1px solid #ffb74d", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "14px", color: "#ef6c00", marginBottom: "10px", fontWeight: 700 }}>Status</div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#ef6c00" }}>{driveError ? "Error" : "Live"}</div>
          <div style={{ marginTop: "8px", color: "#37474f", fontSize: "13px" }}>{driveError || "Drive summary loaded"}</div>
        </div>
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
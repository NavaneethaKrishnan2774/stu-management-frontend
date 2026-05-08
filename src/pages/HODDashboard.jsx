import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function HODDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    API.get("api/students/hod/overview/", token)
      .then((data) => setOverview(data))
      .catch((err) => setError(err?.message || "Unable to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const tiles = [
    {
      title: "Total Students",
      value: overview?.student_count ?? "--",
      description: "Students in your managed department",
      link: "/hod/students",
      icon: "👥",
      color: "#667eea",
    },
    {
      title: "Total Staff",
      value: overview?.staff_count ?? "--",
      description: "Staff currently assigned to your department",
      link: "/hod/staff",
      icon: "👨‍🏫",
      color: "#10b981",
    },
    {
      title: "Low Attendance Students",
      value: overview?.low_attendance_students_count ?? "--",
      description: "Students below 75% attendance",
      link: "/hod/low-attendance?type=students",
      icon: "⚠️",
      color: "#f59e0b",
    },
    {
      title: "Low Attendance Staff",
      value: overview?.low_attendance_staff_count ?? "--",
      description: "Staff members with attendance concerns",
      link: "/hod/low-attendance?type=staff",
      icon: "📊",
      color: "#ef4444",
    },
    {
      title: "Placement Drives",
      value: overview?.placement_drives_count ?? "--",
      description: `${overview?.shortlisted_students_count ?? 0} students shortlisted for placement drives`,
      link: "/hod/placement-drives",
      icon: "🎯",
      color: "#8b5cf6",
    },
    {
      title: "Notifications",
      value: "Manage",
      description: "Create, review, and control department notifications",
      link: "/hod/notifications",
      icon: "🔔",
      color: "#ec4898",
    },
    {
      title: "Analytics",
      value: "Review",
      description: "View pass/fail ratios, weak subjects, and feedback summaries",
      link: "/hod/analytics",
      icon: "📈",
      color: "#06b6d4",
    },
    {
      title: "Classwise Timetable",
      value: "Review",
      description: "Review class timetables, assign faculty, and approve schedule slots",
      link: "/hod/timetables",
      icon: "📅",
      color: "#14b8a6",
    },
  ];

  return (
    <div style={{ 
      maxWidth: "1400px", 
      margin: "0 auto", 
      padding: "24px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh"
    }}>
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "24px",
        padding: "32px",
        marginBottom: "32px",
        color: "white",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <span style={{ fontSize: "48px" }}>👨‍💼</span>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>HOD Dashboard</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>Overview of your department and quick access to student/staff management</p>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ 
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ marginTop: "16px", color: "#64748b" }}>Loading dashboard data...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          backgroundColor: "#fef2f2",
          borderRadius: "20px",
          border: "1px solid #fecaca",
          color: "#991b1b"
        }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>⚠️</span>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px" 
        }}>
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              to={tile.link}
              style={{
                display: "block",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: "20px"
              }}>
                <span style={{ fontSize: "32px" }}>{tile.icon}</span>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: `${tile.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "20px" }}>→</span>
                </div>
              </div>
              <h2 style={{ 
                margin: "0 0 8px 0", 
                fontSize: "16px", 
                fontWeight: "600", 
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>{tile.title}</h2>
              <p style={{ 
                margin: "0 0 12px 0", 
                fontSize: "40px", 
                fontWeight: "700", 
                color: tile.color,
                lineHeight: "1.2"
              }}>{tile.value}</p>
              <p style={{ 
                margin: "12px 0 0 0", 
                fontSize: "13px", 
                color: "#94a3b8",
                lineHeight: "1.5"
              }}>{tile.description}</p>
              
              {/* Decorative gradient bar at bottom */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${tile.color} 0%, ${tile.color}80 100%)`,
                borderRadius: "0 0 20px 20px"
              }} />
            </Link>
          ))}
        </div>
      )}

      {/* Additional Info Section */}
      {!loading && !error && overview && (
        <div style={{ 
          marginTop: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {/* Quick Stats Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
              📊 Department Overview
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b" }}>Student-to-Staff Ratio:</span>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>
                  {overview?.student_count && overview?.staff_count 
                    ? `${(overview.student_count / overview.staff_count).toFixed(1)}:1` 
                    : "--"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b" }}>At-Risk Students:</span>
                <span style={{ fontWeight: "600", color: "#ef4444" }}>
                  {overview?.low_attendance_students_count ?? 0}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b" }}>Placement Shortlisted:</span>
                <span style={{ fontWeight: "600", color: "#10b981" }}>
                  {overview?.shortlisted_students_count ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link to="/hod/students" style={{
                padding: "10px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#667eea",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eef2ff"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}>
                View All Students
                <span>→</span>
              </Link>
              <Link to="/hod/staff" style={{
                padding: "10px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#667eea",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eef2ff"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}>
                Manage Staff
                <span>→</span>
              </Link>
              <Link to="/hod/placement-drives" style={{
                padding: "10px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#667eea",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eef2ff"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}>
                View Placement Drives
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* System Status Card */}
          <div style={{
            backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px",
            padding: "24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
              🎯 System Status
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ opacity: 0.9 }}>Dashboard Active</span>
                <span style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#10b981",
                  display: "inline-block"
                }} />
              </div>
              <div style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: "3px" }} />
              </div>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "13px", opacity: 0.8 }}>
              All systems operational. Ready to manage your department.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
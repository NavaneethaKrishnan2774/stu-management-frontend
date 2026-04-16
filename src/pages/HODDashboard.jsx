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
    },
    {
      title: "Total Staff",
      value: overview?.staff_count ?? "--",
      description: "Staff currently assigned to your department",
      link: "/hod/staff",
    },
    {
      title: "Low Attendance Students",
      value: overview?.low_attendance_students_count ?? "--",
      description: "Students below 75% attendance",
      link: "/hod/low-attendance?type=students",
    },
    {
      title: "Low Attendance Staff",
      value: overview?.low_attendance_staff_count ?? "--",
      description: "Staff members with attendance concerns",
      link: "/hod/low-attendance?type=staff",
    },
    {
      title: "Notifications",
      value: "Manage",
      description: "Create, review, and control department notifications",
      link: "/hod/notifications",
    },
    {
      title: "Analytics",
      value: "Review",
      description: "View pass/fail ratios, weak subjects, and feedback summaries",
      link: "/hod/analytics",
    },
    {
      title: "Timetable Approval",
      value: "Approve",
      description: "Approve timetable entries before they go live",
      link: "/hod/timetables",
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1>HOD Dashboard</h1>
        <p>Overview of your department and quick access to student/staff lists.</p>
      </div>

      {loading && <p>Loading dashboard data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              to={tile.link}
              style={{
                display: "block",
                padding: "22px",
                borderRadius: "18px",
                border: "1px solid #e3e8ef",
                backgroundColor: "#fff",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 10px 30px rgba(32, 57, 91, 0.04)",
                transition: "transform 0.15s ease",
              }}
            >
              <h2 style={{ marginBottom: "12px" }}>{tile.title}</h2>
              <p style={{ margin: 0, fontSize: "36px", fontWeight: 700 }}>{tile.value}</p>
              <p style={{ marginTop: "14px", color: "#555" }}>{tile.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

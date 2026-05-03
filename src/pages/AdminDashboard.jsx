import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/students/available-faculties/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Unable to fetch staff list");
          return;
        }

        const data = await res.json();
        setStaffList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load staff list");
      }
    };

    fetchStaff();
  }, [token]);

  const adminTiles = [
    {
      title: "Staff Registrations",
      value: "Review",
      description: "Approve or reject pending staff registration requests",
      link: "/admin/staff-registrations",
    },
    {
      title: "Current Staff",
      value: `${staffList.length}`,
      description: "View all active staff members in the system",
      link: "#staff-list",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Manage staff registrations and system administration.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {adminTiles.map((tile) => (
          <Link
            key={tile.title}
            to={tile.link}
            style={{
              display: "block",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #e3e8ef",
              backgroundColor: "#fff",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{tile.title}</h3>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1976d2" }}>{tile.value}</p>
            <p style={{ margin: "10px 0 0 0", color: "#666" }}>{tile.description}</p>
          </Link>
        ))}
      </div>

      <div id="staff-list">
        <h2>Available Staff</h2>
        <p>This list shows current staff members available for timetable assignments.</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {staffList.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.id}</td>
                    <td>{staff.full_name || staff.username}</td>
                    <td>{staff.username}</td>
                    <td>{staff.department || "N/A"}</td>
                    <td>{staff.designation || "N/A"}</td>
                    <td>{staff.role || "staff"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

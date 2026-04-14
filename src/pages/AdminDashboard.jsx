import { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
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
  );
}

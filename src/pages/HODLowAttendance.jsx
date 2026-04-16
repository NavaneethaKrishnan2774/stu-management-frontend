import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../services/api";

export default function HODLowAttendance() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") === "staff" ? "staff" : "students";
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    const endpoint = type === "staff" ? "api/students/hod/low-staff/" : "api/students/hod/low-students/";
    API.get(endpoint, token)
      .then((data) => {
        setRecords(data);
      })
      .catch((err) => {
        setError(err?.message || "Unable to load low attendance records.");
      })
      .finally(() => setLoading(false));
  }, [type]);

  const heading = type === "staff" ? "Low Attendance Staff" : "Low Attendance Students";
  const description =
    type === "staff"
      ? "Staff attendance data is not tracked in the current model, so this list may be empty if no low attendance records exist."
      : "Students with attendance percentage below 75% in your managed department.";

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading low attendance records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && records.length === 0 && (
        <div style={{ padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "12px", color: "#555" }}>
          {type === "staff"
            ? "No low attendance staff records are available."
            : "No low attendance students found in your department."}
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeader}>Username</th>
                <th style={tableHeader}>Name</th>
                <th style={tableHeader}>Email</th>
                <th style={tableHeader}>Department</th>
                {type === "students" && <th style={tableHeader}>Year</th>}
                {type === "students" && <th style={tableHeader}>Section</th>}
                <th style={tableHeader}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td style={tableCell}>{record.username}</td>
                  <td style={tableCell}>{`${record.salutation ? record.salutation + " " : ""}${record.first_name || ""} ${record.last_name || ""}`.trim()}</td>
                  <td style={tableCell}>{record.email || "-"}</td>
                  <td style={tableCell}>{record.department || "-"}</td>
                  {type === "students" && <td style={tableCell}>{record.year || "-"}</td>}
                  {type === "students" && <td style={tableCell}>{record.section || "-"}</td>}
                  <td style={tableCell}>{record.attendance_percentage !== null && record.attendance_percentage !== undefined ? `${record.attendance_percentage}%` : "No data"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeader = {
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f7f7f7",
};

const tableCell = {
  padding: "12px 14px",
  borderBottom: "1px solid #eee",
};

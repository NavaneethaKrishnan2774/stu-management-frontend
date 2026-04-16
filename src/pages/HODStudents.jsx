import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function HODStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    API.get("api/students/hod/students/", token)
      .then((data) => {
        setStudents(data);
      })
      .catch((err) => {
        setError(err?.message || "Unable to load students.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Department Students</h1>
          <p>All students in your managed department.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeader}>Username</th>
                <th style={tableHeader}>Name</th>
                <th style={tableHeader}>Email</th>
                <th style={tableHeader}>Department</th>
                <th style={tableHeader}>Year</th>
                <th style={tableHeader}>Section</th>
                <th style={tableHeader}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td style={emptyRow} colSpan={7}>
                    No students found in your department.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td style={tableCell}>{student.username}</td>
                    <td style={tableCell}>{`${student.salutation ? student.salutation + " " : ""}${student.first_name || ""} ${student.last_name || ""}`.trim()}</td>
                    <td style={tableCell}>{student.email || "-"}</td>
                    <td style={tableCell}>{student.department || "-"}</td>
                    <td style={tableCell}>{student.year || "-"}</td>
                    <td style={tableCell}>{student.section || "-"}</td>
                    <td style={tableCell}>{student.attendance_percentage !== null && student.attendance_percentage !== undefined ? `${student.attendance_percentage}%` : "No data"}</td>
                  </tr>
                ))
              )}
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

const emptyRow = {
  padding: "24px",
  textAlign: "center",
  color: "#666",
};

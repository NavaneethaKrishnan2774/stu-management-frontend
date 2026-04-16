import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function HODStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    API.get("api/students/hod/staff/", token)
      .then((data) => {
        setStaff(data);
      })
      .catch((err) => {
        setError(err?.message || "Unable to load staff list.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>Department Staff</h1>
          <p>All staff members in your managed department.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading staff...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeader}>Username</th>
                <th style={tableHeader}>Name</th>
                <th style={tableHeader}>Email</th>
                <th style={tableHeader}>Designation</th>
                <th style={tableHeader}>Faculty FA</th>
                <th style={tableHeader}>Subject Holder</th>
                <th style={tableHeader}>Department</th>
                <th style={tableHeader}>Section</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td style={emptyRow} colSpan={8}>
                    No staff members found in your department.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id}>
                    <td style={tableCell}>{member.username}</td>
                    <td style={tableCell}>{`${member.salutation ? member.salutation + " " : ""}${member.first_name || ""} ${member.last_name || ""}`.trim()}</td>
                    <td style={tableCell}>{member.email || "-"}</td>
                    <td style={tableCell}>{member.designation || "-"}</td>
                    <td style={tableCell}>{member.is_faculty_fa ? "Yes" : "No"}</td>
                    <td style={tableCell}>{member.is_subject_holder ? "Yes" : "No"}</td>
                    <td style={tableCell}>{member.department || "-"}</td>
                    <td style={tableCell}>{member.section || "-"}</td>
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

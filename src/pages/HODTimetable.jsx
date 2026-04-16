import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function HODTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    API.get("api/students/hod/timetables/", token)
      .then((data) => setTimetables(data.timetables || []))
      .catch((err) => setError(err?.message || "Unable to load timetable entries."))
      .finally(() => setLoading(false));
  }, []);

  const approveEntry = async (id) => {
    setActionMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      await API.post(`api/students/hod/approve-timetable/${id}/`, {}, token);
      setActionMessage("Timetable approved.");
      setTimetables((prev) => prev.map((item) => (item.id === id ? { ...item, is_approved: true, approved_by: "You" } : item)));
    } catch (err) {
      setError(err?.message || "Unable to approve timetable entry.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>HOD Timetable Approval</h1>
          <p>Review and approve timetable entries for your department.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading timetable entries...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {actionMessage && <p style={{ color: "green" }}>{actionMessage}</p>}

      {!loading && !error && timetables.length === 0 && (
        <div style={{ padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "12px", color: "#555" }}>
          No timetable entries available for approval.
        </div>
      )}

      {!loading && !error && timetables.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeader}>Subject</th>
                <th style={tableHeader}>Faculty</th>
                <th style={tableHeader}>Year</th>
                <th style={tableHeader}>Section</th>
                <th style={tableHeader}>Day</th>
                <th style={tableHeader}>Time</th>
                <th style={tableHeader}>Approved</th>
                <th style={tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map((item) => (
                <tr key={item.id}>
                  <td style={tableCell}>{item.subject}</td>
                  <td style={tableCell}>{item.faculty}</td>
                  <td style={tableCell}>{item.year}</td>
                  <td style={tableCell}>{item.section}</td>
                  <td style={tableCell}>{item.day}</td>
                  <td style={tableCell}>{item.time}</td>
                  <td style={tableCell}>{item.is_approved ? "Yes" : "No"}</td>
                  <td style={tableCell}>
                    {!item.is_approved ? (
                      <button style={buttonStyle} onClick={() => approveEntry(item.id)}>
                        Approve
                      </button>
                    ) : (
                      <span style={{ color: "#555" }}>Approved</span>
                    )}
                  </td>
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

const buttonStyle = {
  padding: "8px 14px",
  border: "none",
  backgroundColor: "#1976d2",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
};
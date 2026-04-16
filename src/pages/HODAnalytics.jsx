import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function HODAnalytics() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    Promise.all([
      API.get("api/students/hod/results-summary/", token),
      API.get("api/students/hod/subject-performance/", token),
      API.get("api/students/hod/staff-performance/", token),
      API.get("api/students/hod/feedback-summary/", token),
    ])
      .then(([overviewData, subjectsData, staffData, feedbackData]) => {
        setOverview(overviewData);
        setSubjects(subjectsData.subjects || []);
        setStaff(staffData);
        setFeedback(feedbackData);
      })
      .catch((err) => setError(err?.message || "Unable to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>HOD Analytics</h1>
          <p>Result percentages, subject-level performance, staff metrics, and feedback counts.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading analytics...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "24px" }}>
            <div style={cardStyle}>
              <h3>Pass Ratio</h3>
              <p style={metricStyle}>{overview?.pass_ratio ?? "--"}%</p>
            </div>
            <div style={cardStyle}>
              <h3>Fail Ratio</h3>
              <p style={metricStyle}>{overview?.fail_ratio ?? "--"}%</p>
            </div>
            <div style={cardStyle}>
              <h3>Top Performers</h3>
              <p style={metricStyle}>{overview?.top_performers_ratio ?? "--"}%</p>
            </div>
            <div style={cardStyle}>
              <h3>Low Performers</h3>
              <p style={metricStyle}>{overview?.low_performers_ratio ?? "--"}%</p>
            </div>
          </div>

          <section style={{ marginBottom: "24px" }}>
            <h2>Subject Performance</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Subject</th>
                    <th style={tableHeader}>Average Marks</th>
                    <th style={tableHeader}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length === 0 ? (
                    <tr>
                      <td style={emptyRow} colSpan={3}>No subject performance data available.</td>
                    </tr>
                  ) : (
                    subjects.map((item) => (
                      <tr key={item.subject}>
                        <td style={tableCell}>{item.subject}</td>
                        <td style={tableCell}>{item.average}%</td>
                        <td style={tableCell}>{item.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2>Faculty Performance</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Faculty</th>
                    <th style={tableHeader}>Designation</th>
                    <th style={tableHeader}>Average Marks</th>
                    <th style={tableHeader}>Feedback Count</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td style={emptyRow} colSpan={4}>No faculty performance data available.</td>
                    </tr>
                  ) : (
                    staff.map((member) => (
                      <tr key={member.id}>
                        <td style={tableCell}>{member.name || member.username}</td>
                        <td style={tableCell}>{member.designation || "-"}</td>
                        <td style={tableCell}>{member.average_marks !== null ? member.average_marks : "N/A"}</td>
                        <td style={tableCell}>{member.feedback_count ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Feedback Summary</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Faculty</th>
                    <th style={tableHeader}>Forms</th>
                    <th style={tableHeader}>Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.length === 0 ? (
                    <tr>
                      <td style={emptyRow} colSpan={3}>No feedback summary data available.</td>
                    </tr>
                  ) : (
                    feedback.map((item) => (
                      <tr key={item.id}>
                        <td style={tableCell}>{item.name || item.username}</td>
                        <td style={tableCell}>{item.feedback_form_count}</td>
                        <td style={tableCell}>{item.feedback_response_count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  borderRadius: "18px",
  backgroundColor: "#fff",
  boxShadow: "0 10px 30px rgba(32, 57, 91, 0.04)",
};

const metricStyle = {
  marginTop: "14px",
  fontSize: "30px",
  fontWeight: 700,
};

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
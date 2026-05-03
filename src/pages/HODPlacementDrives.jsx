import { useEffect, useState } from "react";
import API from "../services/api";

export default function HODPlacementDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    // Get placement drives for HOD's department
    API.get("api/students/hod/placement-drives/", token)
      .then((data) => setDrives(data))
      .catch((err) => setError(err?.message || "Unable to load placement drives."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1>Placement Drives</h1>
        <p>View placement drives and shortlisted students for your department.</p>
      </div>

      {loading && <p>Loading placement drives...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: "20px" }}>
          {drives.length === 0 ? (
            <p>No placement drives found for your department.</p>
          ) : (
            drives.map((drive) => (
              <div
                key={drive.id}
                style={{
                  padding: "20px",
                  border: "1px solid #e3e8ef",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>{drive.company_name}</h2>
                    <p style={{ margin: "0", color: "#7f8c8d" }}>
                      <strong>Date:</strong> {new Date(drive.drive_date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: "0", color: "#7f8c8d" }}>
                      <strong>Department:</strong> {drive.department}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold", color: "#27ae60" }}>
                      {drive.shortlisted_count} Shortlisted
                    </p>
                    <p style={{ margin: "0", fontSize: "14px", color: "#7f8c8d" }}>
                      {drive.placed_count} Placed
                    </p>
                  </div>
                </div>

                {drive.criteria && (
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Eligibility Criteria:</h3>
                    <div style={{
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      fontSize: "14px"
                    }}>
                      {drive.criteria}
                    </div>
                  </div>
                )}

                {drive.document && (
                  <div style={{ marginBottom: "16px" }}>
                    <a
                      href={drive.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#3498db",
                        textDecoration: "none",
                        fontWeight: "bold"
                      }}
                    >
                      📄 View Drive Document
                    </a>
                  </div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>Shortlisted Students:</h3>
                  {drive.shortlisted_students && drive.shortlisted_students.length > 0 ? (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "8px"
                    }}>
                      {drive.shortlisted_students.map((student) => (
                        <div
                          key={student.id}
                          style={{
                            padding: "8px 12px",
                            backgroundColor: student.status === 'placed' ? "#d4edda" : "#fff3cd",
                            border: `1px solid ${student.status === 'placed' ? "#c3e6cb" : "#ffeaa7"}`,
                            borderRadius: "6px",
                            fontSize: "14px"
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>{student.name}</div>
                          <div style={{ color: "#666", fontSize: "12px" }}>
                            {student.register_number} • CGPA: {student.cgpa || 'N/A'}
                          </div>
                          <div style={{
                            color: student.status === 'placed' ? "#155724" : "#856404",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            {student.status === 'placed' ? '✓ Placed' : 'Shortlisted'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#7f8c8d", fontStyle: "italic" }}>No students shortlisted yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
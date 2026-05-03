import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PlacementStudents() {
  const { department } = useParams();
  const [students] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleSendMessage = async () => {
    alert("Feature coming soon! Messaging API is under development.");
    setShowMessageModal(false);
    setMessageSubject("");
    setMessageText("");
    setSelectedStudents([]);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1>{department} Students</h1>
        <div>
          <button
            onClick={() => navigate("/placement/dashboard")}
            style={{ padding: "8px 16px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setShowMessageModal(true)}
            disabled={selectedStudents.length === 0}
            style={{
              padding: "8px 16px",
              backgroundColor: selectedStudents.length === 0 ? "#ccc" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: selectedStudents.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            Send Message ({selectedStudents.length})
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={handleSelectAll}
          style={{ padding: "8px 16px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {selectedStudents.length === students.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                <input
                  type="checkbox"
                  checked={selectedStudents.length === students.length && students.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Register Number</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Class</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>CGPA</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Arrears</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Attendance %</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Job Offers</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Mobile</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Resume</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ backgroundColor: student.placed ? "#e8f5e8" : "white" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.register_number}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.name}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.class}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.cgpa || "N/A"}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.current_arrears}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.attendance_percentage?.toFixed(1) || "N/A"}%</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.job_offers}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.email}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{student.mobile}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {student.resume ? (
                    <a href={student.resume} target="_blank" rel="noopener noreferrer">View</a>
                  ) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMessageModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90%"
          }}>
            <h3>Send Message</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Subject</label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={6}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleSendMessage}
                style={{ padding: "8px 16px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Send
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                style={{ padding: "8px 16px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
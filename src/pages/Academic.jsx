import { useCallback, useEffect, useMemo, useState } from "react";

const getSubjectAbbreviation = (entry) => {
  if (!entry) return "N/A";
  if (entry.subject_code) return entry.subject_code;
  const words = (entry.subject || "").split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((w) => w[0]).join('').toUpperCase().slice(0, 6);
  }
  return (entry.subject || 'N/A').slice(0, 6).toUpperCase();
};

export default function Academic() {
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [timetableEntries, setTimetableEntries] = useState([]);

  const token = localStorage.getItem("token");
  const department = localStorage.getItem("department");
  const year = localStorage.getItem("year");
  const section = localStorage.getItem("section");

  const BASE_URL = "http://127.0.0.1:8000";

  const handleUnauthorized = useCallback(() => {
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "/login";
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/students/attendance/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (Array.isArray(data)) setAttendance(data);
    } catch (err) {
      console.error(err);
    }
  }, [BASE_URL, handleUnauthorized, token]);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/students/assignments/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (Array.isArray(data)) setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  }, [BASE_URL, handleUnauthorized, token]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/students/my-submissions/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (Array.isArray(data)) setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  }, [BASE_URL, handleUnauthorized, token]);

  useEffect(() => {
    if (!token) return handleUnauthorized();
    fetchAttendance();
    fetchAssignments();
    fetchSubmissions();
  }, [fetchAttendance, fetchAssignments, fetchSubmissions, handleUnauthorized, token]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedSemester) {
        setTimetableEntries([]);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (department) params.set("department", department);
        if (year) params.set("year", year);
        if (section) params.set("section", section);
        params.set("semester", selectedSemester);

        const res = await fetch(
          `${BASE_URL}/api/students/timetable/${params.toString() ? `?${params.toString()}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401) return handleUnauthorized();
        if (!res.ok) return;

        const data = await res.json();
        const entries = Array.isArray(data) ? data : [];
        const filteredEntries = entries.filter(
          (entry) =>
            entry.department === department &&
            entry.year === year &&
            entry.section === section &&
            String(entry.semester) === String(selectedSemester)
        );
        setTimetableEntries(filteredEntries);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTimetable();
  }, [BASE_URL, department, handleUnauthorized, section, selectedSemester, token, year]);

  // ------------------ UPLOAD ------------------

  const handleUpload = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append("file", file);

    const res = await fetch(
      `${BASE_URL}/api/students/submit/`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (res.status === 401) return handleUnauthorized();

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Submitted successfully");
    fetchSubmissions();
  };

  // ------------------ ATTENDANCE ------------------

  const calculateStats = () => {
    let present = 0;
    let absent = 0;

    attendance.forEach((a) => {
      if (a.status === "present") present++;
      else absent++;
    });

    const total = present + absent;
    const percentage = total ? ((present / total) * 100).toFixed(2) : 0;

    return { present, absent, total, percentage };
  };

  const timetableDayHeaders = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timetableRows = [
    { key: "P1", label: "Period 1", time: "9:00 AM - 9:50 AM", isBreak: false },
    { key: "P2", label: "Period 2", time: "9:50 AM - 10:40 AM", isBreak: false },
    { key: "BR1", label: "BREAK", time: "10:40 AM - 10:55 AM", isBreak: true },
    { key: "P3", label: "Period 3", time: "10:55 AM - 11:45 AM", isBreak: false },
    { key: "P4", label: "Period 4", time: "11:45 AM - 12:35 PM", isBreak: false },
    { key: "LN", label: "LUNCH", time: "12:35 PM - 1:25 PM", isBreak: true },
    { key: "P5", label: "Period 5", time: "1:25 PM - 2:15 PM", isBreak: false },
    { key: "P6", label: "Period 6", time: "2:15 PM - 3:05 PM", isBreak: false },
    { key: "BR2", label: "BREAK", time: "3:05 PM - 3:20 PM", isBreak: true },
    { key: "P7", label: "Period 7", time: "3:20 PM - 4:10 PM", isBreak: false },
    { key: "P8", label: "Period 8", time: "4:10 PM - 5:00 PM", isBreak: false },
  ];

  const subjectDetails = useMemo(() => {
    const map = {};
    timetableEntries.forEach((entry) => {
      const key = entry.subject_code || entry.subject || `subject-${entry.id}`;
      if (!map[key]) {
        map[key] = {
          subject_code: entry.subject_code || 'N/A',
          abbreviation: getSubjectAbbreviation(entry),
          subject_title: entry.subject || 'N/A',
          credits: entry.credits != null ? entry.credits : '-',
          periods_per_week: 0,
          faculty: entry.faculty || 'Unassigned',
        };
      }
      map[key].periods_per_week += 1;
    });
    return Object.values(map);
  }, [timetableEntries]);

  const stats = calculateStats();

  // ------------------ FILTER ------------------

  const filteredAssignments = assignments.filter(
    (a) =>
      a.department === department &&
      a.year === year &&
      a.section === section
  );

  const submittedIds = submissions.map((s) => s.assignment_id);

  // ------------------ UI ------------------

  return (
    <div style={{ 
      maxWidth: "1400px", 
      margin: "0 auto", 
      padding: "24px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh"
    }}>
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "24px",
        padding: "32px",
        marginBottom: "32px",
        color: "white",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>📚 Academic Module</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Track your attendance, timetable, and assignments</p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px", 
        marginBottom: "32px" 
      }}>
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "20px", 
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>👤 Student Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#64748b" }}>Department:</span>
              <span style={{ fontWeight: "500", color: "#1e293b" }}>{department}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ color: "#64748b" }}>Year:</span>
              <span style={{ fontWeight: "500", color: "#1e293b" }}>{year}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Section:</span>
              <span style={{ fontWeight: "500", color: "#1e293b" }}>{section}</span>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "20px", 
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>📊 Attendance Summary</h3>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", fontWeight: "700", color: stats.percentage < 75 ? "#ef4444" : "#10b981" }}>
              {stats.percentage}%
            </div>
            <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ 
                width: `${stats.percentage}%`, 
                height: "100%", 
                backgroundColor: stats.percentage < 75 ? "#ef4444" : "#10b981",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e" }}>{stats.present}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Present</div>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#ef4444" }}>{stats.absent}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Absent</div>
            </div>
          </div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>Total Classes: {stats.total}</div>
          {stats.percentage < 75 && (
            <div style={{ 
              marginTop: "12px", 
              padding: "8px 12px", 
              backgroundColor: "#fee2e2", 
              borderRadius: "8px", 
              color: "#991b1b",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              ⚠️ Warning: Low Attendance! Please improve your attendance.
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📅 Timetable</h2>
        
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#475569" }}>Select Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            <option value="">Choose semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        {selectedSemester === "" ? (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b", margin: 0 }}>📖 Please select a semester to view your timetable.</p>
          </div>
        ) : timetableEntries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fef3c7", borderRadius: "16px" }}>
            <p style={{ color: "#92400e", margin: 0 }}>⚠️ No timetable available for Semester {selectedSemester} yet.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", marginBottom: "32px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ textAlign: "left", padding: "16px", fontWeight: "600", color: "#475569" }}>Time / Day</th>
                    {timetableDayHeaders.map((day) => (
                      <th key={day} style={{ textAlign: "center", padding: "16px", fontWeight: "600", color: "#475569" }}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableRows.map((row) =>
                    row.isBreak ? (
                      <tr key={row.key} style={{ backgroundColor: "#f1f5f9" }}>
                        <td style={{ padding: "16px", fontWeight: "700", color: "#475569" }}>{row.time}</td>
                        <td colSpan={timetableDayHeaders.length} style={{ textAlign: "center", padding: "16px", fontWeight: "700", color: "#475569" }}>
                          {row.label}
                        </td>
                      </tr>
                    ) : (
                      <tr key={row.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "16px", fontWeight: "600", backgroundColor: "#fafcff", minWidth: "170px" }}>
                          <div>{row.time}</div>
                          <div style={{ marginTop: "6px", fontSize: "13px", color: "#64748b" }}>{row.label}</div>
                        </td>
                        {timetableDayHeaders.map((day) => {
                          const entry = timetableEntries.find((item) => {
                            const periodValue = String(item.period);
                            return (
                              item.day === day &&
                              (periodValue === row.key || periodValue === row.key.replace(/^P/, ""))
                            );
                          });
                          return (
                            <td key={`${day}-${row.key}`} style={{ padding: "16px", minWidth: "140px", verticalAlign: "top" }}>
                              {entry ? (
                                <div>
                                  <div style={{ fontWeight: "700", color: "#1e293b" }}>{entry.subject_code || entry.subject}</div>
                                  <div style={{ marginTop: "6px", fontSize: "14px", color: "#475569" }}>{entry.subject}</div>
                                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#667eea" }}>{entry.faculty}</div>
                                  {entry.credits && <div style={{ marginTop: "6px", fontSize: "11px", color: "#94a3b8" }}>Credits: {entry.credits}</div>}
                                </div>
                              ) : (
                                <span style={{ color: "#cbd5e1" }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1e293b" }}>📋 Subject Details</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Subject Code</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Abbreviation</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Subject Title</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Credits</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Periods/Week</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: "#475569" }}>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectDetails.map((detail, idx) => (
                    <tr key={`${detail.subject_code}-${idx}`} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: '12px', color: "#334155" }}>{detail.subject_code}</td>
                      <td style={{ padding: '12px', color: "#334155" }}>{detail.abbreviation}</td>
                      <td style={{ padding: '12px', color: "#334155" }}>{detail.subject_title}</td>
                      <td style={{ padding: '12px', color: "#334155" }}>{detail.credits}</td>
                      <td style={{ padding: '12px', color: "#334155" }}>{detail.periods_per_week}</td>
                      <td style={{ padding: '12px', color: "#667eea", fontWeight: "500" }}>{detail.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📝 Assignments</h2>

        {filteredAssignments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b", margin: 0 }}>📭 No assignments available at the moment.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Subject</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Description</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Deadline</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>File</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Marks</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((a, idx) => {
                  const submission = submissions.find(
                    (s) => s.assignment_id === a.id
                  );

                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "white" : "#fafcff" }}>
                      <td style={{ padding: "16px", color: "#334155", fontWeight: "500" }}>{a.subject}</td>
                      <td style={{ padding: "16px", color: "#475569" }}>{a.description}</td>
                      <td style={{ padding: "16px", color: "#64748b", fontSize: "14px" }}>
                        <span style={{ 
                          backgroundColor: new Date(a.deadline) < new Date() ? "#fee2e2" : "#dbeafe",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500",
                          color: new Date(a.deadline) < new Date() ? "#991b1b" : "#1e40af"
                        }}>
                          {a.deadline}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <a
                          href={`${BASE_URL}/media/${a.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: "#667eea", 
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                          📎 Download
                        </a>
                      </td>
                      <td style={{ padding: "16px" }}>
                        {submittedIds.includes(a.id) ? (
                          <span style={{ 
                            backgroundColor: "#d1fae5", 
                            color: "#065f46",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-block"
                          }}>
                            ✅ Submitted
                          </span>
                        ) : (
                          <input
                            type="file"
                            onChange={(e) => handleUpload(a.id, e.target.files[0])}
                            style={{
                              padding: "6px",
                              fontSize: "13px",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              backgroundColor: "white",
                              cursor: "pointer"
                            }}
                          />
                        )}
                      </td>
                      <td style={{ padding: "16px", fontWeight: "600", color: "#1e293b" }}>{submission?.marks || "-"}</td>
                      <td style={{ padding: "16px", color: "#64748b" }}>{submission?.feedback || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
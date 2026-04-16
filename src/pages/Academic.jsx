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
    <div>
      <h1>Academic Module</h1>

      <h2>Student Info</h2>
      <p>Department: {department}</p>
      <p>Year: {year}</p>
      <p>Section: {section}</p>

      {/* ---------------- ATTENDANCE ---------------- */}
      <h2>Attendance Summary</h2>
      <p>Total Classes: {stats.total}</p>
      <p>Present: {stats.present}</p>
      <p>Absent: {stats.absent}</p>
      <p>Percentage: {stats.percentage}%</p>

      {stats.percentage < 75 && (
        <p style={{ color: "red" }}>Warning: Low Attendance!</p>
      )}

      <h2>Timetable</h2>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="semester-select" style={{ marginRight: "12px", fontWeight: 600 }}>
          Select Semester:
        </label>
        <select
          id="semester-select"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
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
        <p>Please select a semester to view your timetable.</p>
      ) : timetableEntries.length === 0 ? (
        <p>No timetable available for Semester {selectedSemester} yet.</p>
      ) : (
        <>
          <div style={{ overflowX: "auto", marginBottom: "28px" }}>
            <table
              border="1"
              cellPadding="10"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}
            >
              <thead>
                <tr style={{ background: "#f4f6fb" }}>
                  <th style={{ textAlign: "left", width: "170px", padding: "12px" }}>
                    Time / Day
                  </th>
                  {timetableDayHeaders.map((day) => (
                    <th key={day} style={{ textAlign: "center", padding: "12px" }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetableRows.map((row) =>
                  row.isBreak ? (
                    <tr key={row.key} style={{ background: "#eef2f8" }}>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: 700,
                          color: "#0b4d91",
                          background: "#eef2f8",
                        }}
                      >
                        {row.time}
                      </td>
                      <td colSpan={timetableDayHeaders.length} style={{ textAlign: "center", padding: "12px", fontWeight: 700, color: "#0b4d91" }}>
                        {row.label}
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.key}>
                      <td style={{ padding: "12px", fontWeight: 600, minWidth: "170px", background: "#fafafa" }}>
                        <div>{row.time}</div>
                        <div style={{ marginTop: "6px", color: "#666" }}>{row.label}</div>
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
                          <td key={`${day}-${row.key}`} style={{ padding: "12px", minWidth: "140px", verticalAlign: "top" }}>
                            {entry ? (
                              <div>
                                <div style={{ fontWeight: 700 }}>{entry.subject_code || entry.subject}</div>
                                <div style={{ marginTop: "6px", color: "#333" }}>{entry.subject}</div>
                                <div style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}>
                                  {entry.faculty}
                                </div>
                                {entry.credits ? (
                                  <div style={{ marginTop: "6px", fontSize: "12px", color: "#888" }}>
                                    Credits: {entry.credits}
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <span style={{ color: "#999" }}>—</span>
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

          <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={detailsHeader}>Subject Code</th>
                  <th style={detailsHeader}>Abbreviation</th>
                  <th style={detailsHeader}>Subject Title</th>
                  <th style={detailsHeader}>Credits</th>
                  <th style={detailsHeader}>Periods / Week</th>
                  <th style={detailsHeader}>Faculty in Charge</th>
                </tr>
              </thead>
              <tbody>
                {subjectDetails.map((detail) => (
                  <tr key={`${detail.subject_code}-${detail.subject_title}`}>
                    <td style={detailsCell}>{detail.subject_code}</td>
                    <td style={detailsCell}>{detail.abbreviation}</td>
                    <td style={detailsCell}>{detail.subject_title}</td>
                    <td style={detailsCell}>{detail.credits}</td>
                    <td style={detailsCell}>{detail.periods_per_week}</td>
                    <td style={detailsCell}>{detail.faculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ---------------- ASSIGNMENTS ---------------- */}
      <h2>Assignments</h2>

      {filteredAssignments.length === 0 ? (
        <p>No assignments available</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>File</th>
              <th>Status</th>
              <th>Marks</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((a) => {
              const submission = submissions.find(
                (s) => s.assignment_id === a.id
              );

              return (
                <tr key={a.id}>
                  <td>{a.subject}</td>
                  <td>{a.description}</td>
                  <td>{a.deadline}</td>

                  <td>
                    <a
                      href={`${BASE_URL}/media/${a.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>

                  <td>
                    {submittedIds.includes(a.id) ? (
                      <span style={{ color: "green" }}>
                        Submitted ✅
                      </span>
                    ) : (
                      <input
                        type="file"
                        onChange={(e) =>
                          handleUpload(a.id, e.target.files[0])
                        }
                      />
                    )}
                  </td>

                  <td>{submission?.marks || "-"}</td>
                  <td>{submission?.feedback || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const detailsHeader = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '2px solid #d1d5db',
  color: '#111827',
  fontSize: '13px',
};

const detailsCell = {
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
  color: '#374151',
  fontSize: '13px',
};
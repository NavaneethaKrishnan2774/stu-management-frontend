import { useEffect, useState } from "react";
import API from "../services/api";

export default function Academic() {
  const [attendance, setAttendance] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const department = localStorage.getItem("department");
  const year = localStorage.getItem("year");
  const section = localStorage.getItem("section");

  useEffect(() => {
    fetchAttendance();
    fetchTimetable();
    fetchAssignments();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get("students/attendance/");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimetable = async () => {
    try {
      const res = await API.get("students/timetable/");
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await API.get("students/assignments/");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (assignmentId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("assignment", assignmentId);
    formData.append("student", 1); // temporary
    formData.append("file", file);

    try {
      await API.post("students/submit/", formData);
      alert("Submitted successfully");
    } catch (err) {
      console.error(err);
    }
  };

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

  const stats = calculateStats();

  const filteredTimetable = timetable.filter(
    (t) =>
      t.day === selectedDay &&
      t.department === department &&
      t.year === year &&
      t.section === section
  );

  const filteredAssignments = assignments.filter(
    (a) =>
      a.department === department &&
      a.year === year &&
      a.section === section
  );

  return (
    <div>
      <h1>Academic Module</h1>

      <h2>Student Info</h2>
      <p>Department: {department}</p>
      <p>Year: {year}</p>
      <p>Section: {section}</p>

      <h2>Attendance Summary</h2>
      <p>Total Classes: {stats.total}</p>
      <p>Present: {stats.present}</p>
      <p>Absent: {stats.absent}</p>
      <p>Percentage: {stats.percentage}%</p>

      {stats.percentage < 75 && (
        <p style={{ color: "red" }}>Warning: Low Attendance!</p>
      )}

      <h2>Attendance</h2>
      {attendance.length === 0 ? (
        <p>No data</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.subject}</td>
                <td>{a.date}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Timetable</h2>
      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
      </select>

      <h2>Timetable ({selectedDay})</h2>

      {filteredTimetable.length === 0 ? (
        <p>No timetable available</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Time</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimetable.map((t) => (
              <tr key={t.id}>
                <td>{t.subject}</td>
                <td>{t.time}</td>
                <td>{t.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((a) => (
              <tr key={a.id}>
                <td>{a.subject}</td>
                <td>{a.description}</td>
                <td>{a.deadline}</td>
                <td>
                  <a
                    href={`http://127.0.0.1:8000/media/${a.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </td>
                <td>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleSubmit(a.id, e.target.files[0])
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
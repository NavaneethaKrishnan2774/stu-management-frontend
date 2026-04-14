import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedFeedbackFormId, setSelectedFeedbackFormId] = useState("");
  const [subjectStaffSelections, setSubjectStaffSelections] = useState({});
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState(null);

  const navigate = useNavigate();

  const department = localStorage.getItem("department") || "";
  const year = localStorage.getItem("year") || "";
  const section = localStorage.getItem("section") || "";
  const token = localStorage.getItem("token");

  const feedbackCriteriaByType = {
    semester: [
      { key: "communication", label: "Teacher Communication Skill (clear and understandable)" },
      { key: "explanation", label: "Explanation of Subject Matter (concept clarity level)" },
      { key: "knowledge", label: "Subject Knowledge (depth of knowledge)" },
      { key: "engagement", label: "Ability to Engage Class (keeps class active)" },
      { key: "doubt_clarification", label: "Doubt Clarification (resolves student queries)" },
      { key: "syllabus_coverage", label: "Syllabus Coverage (portion completed properly)" },
      { key: "practical_examples", label: "Practical Examples (real-world explanations)" },
      { key: "industry_relevance", label: "Industry Relevance (aligned with industry needs)" },
      { key: "skill_development", label: "Skill Development (improves practical skills)" },
      { key: "teaching_pace", label: "Teaching Pace (speed of teaching)" },
      { key: "teaching_aids", label: "Use of Teaching Aids (PPT, tools usage)" },
      { key: "overall_effectiveness", label: "Overall Teaching Effectiveness (overall performance rating)" },
    ],
    event: [
      { key: "organization", label: "Event Organization (planning and structure)" },
      { key: "time_management", label: "Time Management (on-time execution)" },
      { key: "content_quality", label: "Content Quality (useful information provided)" },
      { key: "speaker_performance", label: "Speaker Performance (delivery and clarity)" },
      { key: "audience_engagement", label: "Audience Engagement (interaction with participants)" },
      { key: "venue_arrangement", label: "Venue Arrangement (seating and setup)" },
      { key: "technical_support", label: "Technical Support (audio, visuals working)" },
      { key: "overall_experience", label: "Overall Experience (general satisfaction level)" },
    ],
    course: [
      { key: "course_material", label: "Course Material Quality" },
      { key: "assignments", label: "Assignments and Assessment" },
      { key: "support", label: "Instructor Support" },
      { key: "difficulty", label: "Course Difficulty Level" },
      { key: "clarity", label: "Clarity of Course Objectives" },
    ],
    faculty: [
      { key: "communication", label: "Communication Skill (clarity in speech)" },
      { key: "teaching_clarity", label: "Teaching Clarity (easy to understand)" },
      { key: "subject_knowledge", label: "Subject Knowledge (strong concept understanding)" },
      { key: "student_interaction", label: "Student Interaction (engages with students)" },
      { key: "doubt_handling", label: "Doubt Handling (answers questions clearly)" },
      { key: "punctuality", label: "Punctuality (comes on time)" },
      { key: "fairness", label: "Fairness (equal treatment to all)" },
      { key: "approachability", label: "Approachability (easy to approach)" },
      { key: "class_control", label: "Class Control (manages discipline)" },
      { key: "guidance", label: "Guidance & Mentorship (supports student growth)" },
      { key: "overall_performance", label: "Overall Performance (overall teaching quality)" },
    ],
    general: [
      { section: "Transport" },
      { key: "bus_availability", label: "Bus Availability (sufficient transport access)" },
      { key: "timing_punctuality", label: "Timing Punctuality (on-time arrival/departure)" },
      { key: "travel_comfort", label: "Travel Comfort (seating and crowd level)" },
      { section: "Hostel" },
      { key: "room_cleanliness", label: "Room Cleanliness (hygiene of rooms)" },
      { key: "water_electricity", label: "Water & Electricity (basic facilities availability)" },
      { key: "security", label: "Security (safety measures provided)" },
      { section: "Food / Canteen" },
      { key: "food_quality", label: "Food Quality (taste and hygiene)" },
      { key: "food_variety", label: "Food Variety (menu diversity)" },
      { key: "pricing", label: "Pricing (affordable cost level)" },
      { section: "Maintenance" },
      { key: "washroom_cleanliness", label: "Washroom Cleanliness (clean and usable)" },
      { key: "maintenance_response", label: "Maintenance Response (quick issue fixing)" },
      { section: "Classroom & Campus" },
      { key: "classroom_cleanliness", label: "Classroom Cleanliness (neat learning space)" },
      { key: "infrastructure_quality", label: "Infrastructure Quality (benches, boards condition)" },
      { key: "campus_maintenance", label: "Overall Campus Maintenance (general upkeep)" },
      { section: "Final" },
      { key: "overall_satisfaction", label: "Overall Satisfaction (overall experience level)" },
      { key: "suggestions", label: "Suggestions (improvement ideas)", type: "textarea" },
    ],
  };

  const formTypeLabels = {
    semester: "Semester",
    event: "Event",
    faculty: "Faculty",
    general: "General",
    course: "Course",
  };

  const getUniqueNotifications = (notifs) => {
    const seen = new Set();
    return notifs.filter((n) => {
      const key = [n.title, n.message, n.file, n.scheduled_time].join("||");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const isNotificationActive = (notification) => {
    if (!notification?.scheduled_time) return true;
    const scheduled = new Date(notification.scheduled_time);
    return !Number.isNaN(scheduled.getTime()) && scheduled >= new Date();
  };

  const filterActiveNotifications = (notifications) =>
    notifications.filter(isNotificationActive);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/students/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(getUniqueNotifications(filterActiveNotifications(Array.isArray(data) ? data : [])));
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/students/notification-count/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count || 0);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchAttendancePercentage = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/students/attendance-percentage/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setAttendancePercentage(data.percentage ?? 0);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchFeedbackForms = useCallback(async () => {
    if (!selectedSemester) return;
    try {
      const res = await fetch(`${BASE_URL}/api/students/feedback-forms/?semester=${selectedSemester}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setFeedbackForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [selectedSemester, token]);

  const fetchSemesterSubjects = useCallback(async () => {
    if (!selectedSemester) return;
    try {
      const params = new URLSearchParams();
      if (department) params.set("department", department);
      if (year) params.set("year", year);
      if (section) params.set("section", section);
      params.set("semester", selectedSemester);

      const res = await fetch(`${BASE_URL}/api/students/timetable/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const uniqueSubjects = Array.from(
        new Map(
          (Array.isArray(data) ? data : []).map((entry) => [
            entry.subject_code || entry.subject,
            { subject_code: entry.subject_code, subject: entry.subject },
          ])
        ).values()
      );
      setSemesterSubjects(uniqueSubjects);
    } catch (err) {
      console.error(err);
    }
  }, [department, year, section, selectedSemester, token]);

  const fetchFacultyOptions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (department) params.set("department", department);
      if (year) params.set("year", year);
      if (section) params.set("section", section);

      const res = await fetch(
        `${BASE_URL}/api/students/available-faculties/${params.toString() ? `?${params.toString()}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setFacultyOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [department, year, section, token]);

  const handleStaffSelection = (subjectKey, staffUsername) => {
    setSubjectStaffSelections((prev) => ({
      ...prev,
      [subjectKey]: staffUsername,
    }));
  };

  const handleRatingChange = (subjectKey, criterionKey, value) => {
    const key = subjectKey ? `${subjectKey}-${criterionKey}` : criterionKey;
    setFeedbackRatings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const moduleNavItems = [
    { label: "Academic", path: "/academics" },
    { label: "Administrative", path: "/administration" },
    { label: "Development", path: "/development" },
    { label: "Communication", path: "/communication" },
    { label: "Analytics", path: "/analytics" },
    { label: "Navigation", path: "/navigation" },
  ];

  const selectedFeedbackForm = feedbackForms.find(
    (form) => form.id === parseInt(selectedFeedbackFormId, 10)
  );

  const selectedFormType = selectedFeedbackForm?.form_type || "semester";
  const currentFeedbackCriteria = feedbackCriteriaByType[selectedFormType] || feedbackCriteriaByType.semester;
  const isSubjectForm = selectedFormType === "semester" || selectedFormType === "faculty";

  const handleSubmitFeedback = async () => {
    if (!selectedFeedbackForm) {
      alert("No active feedback form is selected.");
      return;
    }

    if (isSubjectForm && semesterSubjects.length === 0) {
      alert("No subjects are available for this semester.");
      return;
    }

    if (isSubjectForm) {
      const missingStaff = semesterSubjects.some((subject) => {
        const subjectKey = subject.subject_code || subject.subject;
        return !subjectStaffSelections[subjectKey];
      });
      if (missingStaff) {
        alert("Select a staff member for each subject.");
        return;
      }
    }

    const missingRating = isSubjectForm
      ? semesterSubjects.some((subject) => {
          const subjectKey = subject.subject_code || subject.subject;
          return currentFeedbackCriteria.some((criterion) => {
            const value = feedbackRatings[`${subjectKey}-${criterion.key}`];
            return !value || value.toString().trim() === "";
          });
        })
      : currentFeedbackCriteria.some((criterion) => {
          const value = feedbackRatings[criterion.key];
          return !value || value.toString().trim() === "";
        });

    if (missingRating) {
      alert("Fill all ratings for every required criterion.");
      return;
    }

    const responseData = {
      form_title: selectedFeedbackForm.title,
      form_type: selectedFormType,
      comments: feedbackComments,
      submitted_at: new Date().toISOString(),
    };

    if (isSubjectForm) {
      const subjectRatings = semesterSubjects.map((subject) => {
        const subjectKey = subject.subject_code || subject.subject;
        const ratings = {};
        currentFeedbackCriteria.forEach((criterion) => {
          ratings[criterion.key] = feedbackRatings[`${subjectKey}-${criterion.key}`];
        });
        return {
          subject_code: subject.subject_code,
          subject: subject.subject,
          faculty_username: subjectStaffSelections[subjectKey],
          ratings,
        };
      });
      responseData.semester = selectedFeedbackForm.semester;
      responseData.subject_staff_ratings = subjectRatings;
    } else {
      responseData.ratings = currentFeedbackCriteria.reduce((acc, criterion) => {
        acc[criterion.key] = feedbackRatings[criterion.key];
        return acc;
      }, {});
      responseData.topic = selectedFeedbackForm.subject;
      responseData.topic_code = selectedFeedbackForm.subject_code;
      responseData.target_faculty = selectedFeedbackForm.faculty;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/students/submit-feedback/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_id: selectedFeedbackForm.id,
          response_text: JSON.stringify(responseData),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit feedback");
        return;
      }

      setFeedbackRatings({});
      setFeedbackComments("");
      setSubjectStaffSelections({});
      setFeedbackStatus("Feedback submitted successfully.");
      fetchFeedbackForms();
    } catch (err) {
      console.error(err);
      alert("Unable to submit feedback.");
    }
  };

  const handleBellClick = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      await fetchNotifications();
    }
    try {
      await fetch(`${BASE_URL}/api/students/mark-read/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCount();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchCount();
    fetchAttendancePercentage();
    fetchFacultyOptions();
  }, [fetchNotifications, fetchCount, fetchAttendancePercentage, fetchFacultyOptions]);

  useEffect(() => {
    if (!selectedSemester) {
      setFeedbackForms([]);
      setSemesterSubjects([]);
      setSelectedFeedbackFormId("");
      return;
    }
    fetchFeedbackForms();
    fetchSemesterSubjects();
    fetchFacultyOptions();
  }, [selectedSemester, fetchFeedbackForms, fetchSemesterSubjects, fetchFacultyOptions]);

  useEffect(() => {
    if (feedbackForms.length > 0 && !selectedFeedbackFormId) {
      setSelectedFeedbackFormId(feedbackForms[0].id);
    }
  }, [feedbackForms, selectedFeedbackFormId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
      fetchCount();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchCount]);

  const lowAttendance = attendancePercentage !== null && attendancePercentage < 75;

  return (
    <div>
      <h2>Student Dashboard</h2>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: "1 1 320px" }}>
          <h3>Summary</h3>
          <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "12px", background: "#fafafa" }}>
            <p style={{ margin: "8px 0", fontWeight: 600 }}>Attendance: {attendancePercentage !== null ? `${attendancePercentage}%` : "Loading..."}</p>
            <p style={{ margin: "8px 0" }}>Next Exam: Math - 25th</p>
            <p style={{ margin: "8px 0" }}>Placement: Infosys Drive Soon</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={handleBellClick} style={{ padding: "10px 14px", borderRadius: "8px", cursor: "pointer" }}>
            🔔 {count > 0 && <span>({count})</span>}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "14px", marginBottom: "24px" }}>
        {moduleNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              height: "100px",
              borderRadius: "50%",
              border: "none",
              background: "#0b74ff",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "24px", padding: "14px", background: "#f1f8ff", border: "1px solid #dceeff", borderRadius: "10px" }}>
        <strong>Note:</strong> Your timetable is now available in the Academic module.

        {open && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "0",
              width: "320px",
              border: "1px solid #ccc",
              background: "#fff",
              padding: "10px",
              maxHeight: "320px",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ marginBottom: "10px" }}>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  {n.file && (
                    <a
                      href={`http://127.0.0.1:8000${n.file}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View File
                    </a>
                  )}
                  <hr />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>Attendance</h3>
        <p>
          Current attendance: {attendancePercentage !== null ? `${attendancePercentage}%` : "Loading..."}
        </p>
        {lowAttendance && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            ⚠ Low Attendance: Please improve your attendance.
          </p>
        )}
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3>Select Semester</h3>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={{ width: "100%", height: "40px", marginTop: "8px" }}
        >
          <option value="">-- Select Semester --</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>

        {selectedSemester !== "" && feedbackForms.length > 1 && (
          <div style={{ marginTop: "20px" }}>
            <label>
              Select active feedback form:
              <select
                value={selectedFeedbackFormId}
                onChange={(e) => setSelectedFeedbackFormId(e.target.value)}
                style={{ width: "100%", height: "40px", marginTop: "8px" }}
              >
                {feedbackForms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.title} ({form.subject_code || form.subject})
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {selectedSemester === "" ? (
          <p style={{ marginTop: "20px" }}>Please choose a semester to continue.</p>
        ) : feedbackForms.length === 0 ? (
          <p style={{ marginTop: "20px" }}>
            No active feedback forms are available for this semester.
          </p>
        ) : (
          <div style={{ marginTop: "24px", border: "1px solid #ccc", padding: "20px" }}>
            {!selectedFeedbackForm ? (
              <p>Please select a feedback form from the menu above.</p>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <strong>Active Form:</strong> {selectedFeedbackForm.title} <br />
                  <small>
                    {formTypeLabels[selectedFormType] || "Semester"} Feedback
                    {selectedFeedbackForm.subject ? ` — ${selectedFeedbackForm.subject}` : ""}
                    {selectedFeedbackForm.subject_code ? ` (${selectedFeedbackForm.subject_code})` : ""}
                    {selectedFeedbackForm.available_until ? ` — available until ${new Date(selectedFeedbackForm.available_until).toLocaleString()}` : ''}
                  </small>
                </div>

                {selectedFormType !== "semester" && (
                  <div style={{ marginBottom: "20px", padding: "14px", background: "#f9fafe", borderRadius: "10px" }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>Feedback topic:</p>
                    <p style={{ margin: "8px 0" }}>{selectedFeedbackForm.subject || "No topic provided"}</p>
                    {selectedFeedbackForm.subject_code && (
                      <p style={{ margin: "4px 0", color: "#555" }}>Type: {selectedFeedbackForm.subject_code}</p>
                    )}
                  </div>
                )}

                {isSubjectForm ? (
                  <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                    <table
                      border="1"
                      cellPadding="8"
                      cellSpacing="0"
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", width: "28%", padding: "10px" }}>Criteria</th>
                          {semesterSubjects.map((subject) => {
                            const subjectKey = subject.subject_code || subject.subject;
                            return (
                              <th key={subjectKey} style={{ textAlign: "center", padding: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <select
                                    value={subjectStaffSelections[subjectKey] || ""}
                                    onChange={(e) => handleStaffSelection(subjectKey, e.target.value)}
                                    style={{ width: "100%", height: "34px" }}
                                  >
                                    <option value="">Select staff</option>
                                    {facultyOptions.map((staff) => (
                                      <option key={staff.username} value={staff.username}>
                                        {staff.first_name || staff.username} {staff.last_name || ''}
                                      </option>
                                    ))}
                                  </select>
                                  <div style={{ fontWeight: 600, marginTop: "4px" }}>
                                    {subject.subject_code ? `${subject.subject_code} - ${subject.subject}` : subject.subject}
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {currentFeedbackCriteria.map((criterion) => (
                          <tr key={criterion.key}>
                            <td style={{ textAlign: "left", padding: "10px" }}>{criterion.label}</td>
                            {semesterSubjects.map((subject) => {
                              const subjectKey = subject.subject_code || subject.subject;
                              return (
                                <td key={`${subjectKey}-${criterion.key}`} style={{ textAlign: "center", padding: "10px" }}>
                                  <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={feedbackRatings[`${subjectKey}-${criterion.key}`] || ""}
                                    onChange={(e) => handleRatingChange(subjectKey, criterion.key, e.target.value)}
                                    style={{ width: "80px", textAlign: "center" }}
                                    placeholder="1-5"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                    <table
                      border="1"
                      cellPadding="8"
                      cellSpacing="0"
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", width: "70%", padding: "10px" }}>Criteria</th>
                          <th style={{ textAlign: "center", padding: "10px" }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFeedbackCriteria.map((criterion) => {
                          if (criterion.section) {
                            return (
                              <tr key={`section-${criterion.section}`}>
                                <td
                                  colSpan="2"
                                  style={{
                                    textAlign: "left",
                                    padding: "10px",
                                    background: "#eef2ff",
                                    fontWeight: 700,
                                  }}
                                >
                                  {criterion.section}
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={criterion.key}>
                              <td style={{ textAlign: "left", padding: "10px" }}>{criterion.label}</td>
                              <td style={{ textAlign: "center", padding: "10px" }}>
                                {criterion.type === "textarea" ? (
                                  <textarea
                                    rows={3}
                                    value={feedbackRatings[criterion.key] || ""}
                                    onChange={(e) => handleRatingChange(null, criterion.key, e.target.value)}
                                    style={{ width: "100%" }}
                                    placeholder="Write your suggestion"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={feedbackRatings[criterion.key] || ""}
                                    onChange={(e) => handleRatingChange(null, criterion.key, e.target.value)}
                                    style={{ width: "80px", textAlign: "center" }}
                                    placeholder="1-5"
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ marginTop: "20px" }}>
                  <label>
                    Comments and suggestions:
                    <textarea
                      rows={4}
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      style={{ width: "100%", marginTop: "10px" }}
                      placeholder="Write your feedback and suggestions here"
                    />
                  </label>
                </div>

                <button
                  onClick={handleSubmitFeedback}
                  style={{ marginTop: "16px", padding: "10px 16px" }}
                >
                  Submit Feedback
                </button>

                {feedbackStatus && (
                  <p style={{ color: "green", marginTop: "14px" }}>{feedbackStatus}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeToken } from "../services/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [semesterTimetableEntries, setSemesterTimetableEntries] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedFeedbackFormId, setSelectedFeedbackFormId] = useState("");
  const [subjectStaffSelections, setSubjectStaffSelections] = useState({});
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [placementDrives, setPlacementDrives] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  const navigate = useNavigate();

  const department = localStorage.getItem("department") || "";
  const year = localStorage.getItem("year") || "";
  const section = localStorage.getItem("section") || "";
  const token = normalizeToken(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/students/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.profile_photo) {
          const url = data.profile_photo.startsWith("http")
            ? data.profile_photo
            : `${BASE_URL}${data.profile_photo}`;
          setProfilePhotoUrl(url);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token, navigate]);

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
      if (!token) return;
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
      if (!token) return;
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
      if (!token) return;
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

  const fetchPlacementDrives = useCallback(async () => {
    try {
      if (!token) return;
      const res = await fetch(`${BASE_URL}/api/students/student/placement-drives/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setPlacementDrives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchFeedbackForms = useCallback(async () => {
    if (!selectedSemester) return;
    try {
      if (!token) return;
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
    if (!selectedSemester) {
      setSemesterSubjects([]);
      setSemesterTimetableEntries([]);
      return;
    }
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
      const entries = Array.isArray(data) ? data : [];
      const uniqueSubjects = Array.from(
        new Map(
          entries.map((entry) => [
            entry.subject_code || entry.subject,
            { subject_code: entry.subject_code, subject: entry.subject },
          ])
        ).values()
      );
      setSemesterSubjects(uniqueSubjects);
      setSemesterTimetableEntries(entries);
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

      if (!token) return;
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login", { replace: true });
  };

  const handleProfileClick = () => {
    navigate("/student/profile");
  };

  const handleBellClick = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      await fetchNotifications();
    }
    try {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      await fetch(`${BASE_URL}/api/students/mark-read/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCount();
    } catch (err) {
      console.error(err);
    }
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

  const generateTimetableHtml = () => {
    const heading = `Timetable for ${department}-${year}${section} Semester ${selectedSemester}`;
    const rowsHtml = timetableRows
      .map((row) => {
        if (row.isBreak) {
          return `<tr style="background:#eef2f8;"><td style="padding:12px;font-weight:700;color:#0b4d91;">${row.time}</td><td colspan="6" style="text-align:center;padding:12px;font-weight:700;color:#0b4d91;">${row.label}</td></tr>`;
        }

        const cells = timetableDayHeaders
          .map((day) => {
            const entry = semesterTimetableEntries.find((item) => {
              const periodValue = String(item.period || "");
              return item.day === day && (periodValue === row.key || periodValue === row.key.replace(/^P/, ""));
            });
            if (!entry) {
              return `<td style="padding:12px;min-width:140px;vertical-align:top;color:#999;">—</td>`;
            }
            return `<td style="padding:12px;min-width:140px;vertical-align:top;"><div style="font-weight:700;">${entry.subject_code || entry.subject || "N/A"}</div><div style="margin-top:6px;color:#333;">${entry.subject || ""}</div><div style="margin-top:8px;font-size:12px;color:#555;">${entry.faculty || "Unassigned"}</div>${entry.credits ? `<div style="margin-top:6px;font-size:12px;color:#888;">Credits: ${entry.credits}</div>` : ""}</td>`;
          })
          .join("");

        return `<tr><td style="padding:12px;font-weight:600;min-width:170px;background:#fafafa;">${row.time}<div style="margin-top:6px;color:#666;">${row.label}</div></td>${cells}</tr>`;
      })
      .join("");

    const subjectRows = semesterSubjects
      .map((subject) => {
        const key = subject.subject_code || subject.subject || "";
        const entry = semesterTimetableEntries.find((item) => item.subject_code === subject.subject_code || item.subject === subject.subject);
        return `<tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${subject.subject_code || "N/A"}</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${subject.subject_code ? subject.subject_code : key}</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${subject.subject || "N/A"}</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${entry?.credits ?? "-"}</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${semesterTimetableEntries.filter((item) => item.subject_code === subject.subject_code || item.subject === subject.subject).length}</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;">${entry?.faculty || "Unassigned"}</td></tr>`;
      })
      .join("");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${heading}</title>
</head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#212121;line-height:1.5;">
  <h1 style="text-align:center;">${heading}</h1>
  <p style="text-align:center;margin-top:0;">Class: ${department}-${section} | Year: ${year} | Semester: ${selectedSemester}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:20px;" border="1">
    <thead><tr style="background:#f4f6fb;"><th style="padding:12px;text-align:left;">Time / Day</th>${timetableDayHeaders.map((day) => `<th style="padding:12px;text-align:center;">${day}</th>`).join("")}</tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <h2 style="margin-top:30px;">Subject Summary</h2>
  <table style="width:100%;border-collapse:collapse;" border="1">
    <thead><tr style="background:#f9fafb;"><th style="padding:12px;text-align:left;">Subject Code</th><th style="padding:12px;text-align:left;">Abbreviation</th><th style="padding:12px;text-align:left;">Subject Title</th><th style="padding:12px;text-align:left;">Credits</th><th style="padding:12px;text-align:left;">Periods / Week</th><th style="padding:12px;text-align:left;">Faculty in Charge</th></tr></thead>
    <tbody>${subjectRows}</tbody>
  </table>
</body>
</html>`;
  };

  const handleDownloadTimetable = () => {
    if (!semesterTimetableEntries.length || !selectedSemester) return;
    const html = generateTimetableHtml();
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timetable-${department}-${year}${section}-sem${selectedSemester}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchNotifications();
    fetchCount();
    fetchAttendancePercentage();
    fetchPlacementDrives();
    fetchFacultyOptions();
  }, [fetchNotifications, fetchCount, fetchAttendancePercentage, fetchPlacementDrives, fetchFacultyOptions]);

  useEffect(() => {
    if (!selectedSemester) {
      setFeedbackForms([]);
      setSemesterSubjects([]);
      setSelectedFeedbackFormId("");
      return;
    }

    setSelectedFeedbackFormId("");
    fetchFeedbackForms();
    fetchSemesterSubjects();
    fetchFacultyOptions();
  }, [selectedSemester, fetchFeedbackForms, fetchSemesterSubjects, fetchFacultyOptions]);

  useEffect(() => {
    if (feedbackForms.length === 0) {
      setSelectedFeedbackFormId("");
      return;
    }

    const currentId = parseInt(selectedFeedbackFormId, 10);
    if (!selectedFeedbackFormId || !feedbackForms.some((form) => form.id === currentId)) {
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

  const nextPlacementDrive = placementDrives
    .filter((drive) => new Date(drive.drive_date) >= new Date())
    .sort((a, b) => new Date(a.drive_date) - new Date(b.drive_date))[0];

  const totalPlacementDrives = placementDrives.length;
  const totalPlacedStudents = placementDrives.reduce((sum, drive) => sum + (drive.total_placed || 0), 0);
  const totalApplications = placementDrives.reduce((sum, drive) => sum + (drive.total_applied || 0), 0);

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              onClick={handleProfileClick}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "3px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                fontSize: "24px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="Click to view profile"
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              ) : (
                "👨‍🎓"
              )}
            </div>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>Welcome Back, Student!</h1>
              <p style={{ opacity: 0.9, margin: 0 }}>Department: {department} | Year: {year} | Section: {section}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                padding: "12px 20px",
                borderRadius: "50px",
                cursor: "pointer",
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              🚪 Logout
            </button>
            <button 
              onClick={handleBellClick} 
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                padding: "12px 20px",
                borderRadius: "50px",
                cursor: "pointer",
                color: "white",
                fontSize: "18px",
                fontWeight: "500",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            >
              🔔 Notifications {count > 0 && <span style={{ 
                background: "#ff4757",
                borderRadius: "50%", 
                padding: "2px 8px", 
                marginLeft: "8px",
                fontSize: "14px"
              }}>{count}</span>}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div style={{
          position: "fixed",
          top: "100px",
          right: "24px",
          width: "400px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          zIndex: 1000,
          maxHeight: "500px",
          overflow: "auto"
        }}>
          <div style={{ 
            padding: "20px", 
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            borderRadius: "16px 16px 0 0"
          }}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>🔔 Notifications</h3>
          </div>
          <div style={{ padding: "16px" }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ 
                  marginBottom: "16px", 
                  padding: "12px", 
                  backgroundColor: "#f1f5f9", 
                  borderRadius: "12px",
                  borderLeft: "3px solid #667eea"
                }}>
                  <strong style={{ display: "block", marginBottom: "8px", color: "#1e293b" }}>{n.title}</strong>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#475569" }}>{n.message}</p>
                  {n.file && (
                    <a
                      href={`http://127.0.0.1:8000${n.file}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#667eea", fontSize: "14px", textDecoration: "none" }}
                    >
                      📎 View Attachment
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>📊 Attendance Overview</h3>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", fontWeight: "700", color: lowAttendance ? "#ef4444" : "#10b981" }}>
              {attendancePercentage !== null ? `${attendancePercentage}%` : "Loading..."}
            </div>
            <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ 
                width: `${attendancePercentage || 0}%`, 
                height: "100%", 
                backgroundColor: lowAttendance ? "#ef4444" : "#10b981",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
          {lowAttendance && (
            <div style={{ 
              backgroundColor: "#fee2e2", 
              padding: "12px", 
              borderRadius: "12px", 
              color: "#991b1b",
              fontSize: "14px"
            }}>
              ⚠️ Low Attendance: Please improve your attendance.
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "20px", 
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>💼 Placement Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#667eea" }}>{totalPlacementDrives}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Active Drives</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#667eea" }}>{totalApplications}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Applications</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#10b981" }}>{totalPlacedStudents}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Students Placed</div>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f59e0b" }}>{nextPlacementDrive ? `${nextPlacementDrive.company_name}` : "No upcoming"}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Next Drive</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
        gap: "16px", 
        marginBottom: "40px" 
      }}>
        {moduleNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: "24px 16px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📅 Timetable</h2>
            <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>View your approved class schedule</p>
          </div>
          <button
            onClick={handleDownloadTimetable}
            disabled={!semesterTimetableEntries.length || !selectedSemester}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: semesterTimetableEntries.length ? "#667eea" : "#cbd5e1",
              color: "white",
              border: "none",
              cursor: semesterTimetableEntries.length ? "pointer" : "not-allowed",
              fontWeight: "500",
              transition: "background 0.2s ease"
            }}
          >
            📥 Download Timetable
          </button>
        </div>

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
              backgroundColor: "white"
            }}
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
        </div>

        {selectedSemester === "" ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>Choose a semester to load your approved timetable.</p>
        ) : semesterTimetableEntries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>No approved timetable is available for Semester {selectedSemester} yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                        const entry = semesterTimetableEntries.find((item) => {
                          const periodValue = String(item.period || "");
                          return item.day === day && (periodValue === row.key || periodValue === row.key.replace(/^P/, ""));
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

            <div style={{ overflowX: 'auto', marginTop: '32px' }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Subject Details</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Subject Code</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Abbreviation</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Subject Title</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Credits</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Periods/Week</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: "#475569" }}>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterSubjects.map((subject, idx) => {
                    const entry = semesterTimetableEntries.find(
                      (item) => item.subject_code === subject.subject_code || item.subject === subject.subject
                    );
                    const periods = semesterTimetableEntries.filter(
                      (item) => item.subject_code === subject.subject_code || item.subject === subject.subject
                    ).length;
                    return (
                      <tr key={`${subject.subject_code}-${idx}`} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: '12px', color: "#334155" }}>{subject.subject_code || 'N/A'}</td>
                        <td style={{ padding: '12px', color: "#334155" }}>{subject.subject_code || subject.subject}</td>
                        <td style={{ padding: '12px', color: "#334155" }}>{subject.subject || 'N/A'}</td>
                        <td style={{ padding: '12px', color: "#334155" }}>{entry?.credits ?? '-'}</td>
                        <td style={{ padding: '12px', color: "#334155" }}>{periods}</td>
                        <td style={{ padding: '12px', color: "#667eea", fontWeight: "500" }}>{entry?.faculty || 'Unassigned'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📝 Feedback</h2>

        {selectedSemester === "" ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>Please choose a semester to continue.</p>
        ) : feedbackForms.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>No active feedback forms are available for this semester.</p>
        ) : (
          <>
            {feedbackForms.length > 1 && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#475569" }}>Select Feedback Form:</label>
                <select
                  value={selectedFeedbackFormId}
                  onChange={(e) => setSelectedFeedbackFormId(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    backgroundColor: "white"
                  }}
                >
                  {feedbackForms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.title} ({form.subject_code || form.subject})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!selectedFeedbackForm ? (
              <p>Please select a feedback form from the menu above.</p>
            ) : (
              <div>
                <div style={{ 
                  backgroundColor: "#f1f5f9", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  marginBottom: "24px",
                  borderLeft: "4px solid #667eea"
                }}>
                  <strong style={{ fontSize: "16px", color: "#1e293b" }}>📋 {selectedFeedbackForm.title}</strong>
                  <div style={{ marginTop: "8px", fontSize: "14px", color: "#64748b" }}>
                    Type: {formTypeLabels[selectedFormType] || "Semester"} Feedback
                    {selectedFeedbackForm.subject && ` — ${selectedFeedbackForm.subject}`}
                    {selectedFeedbackForm.subject_code && ` (${selectedFeedbackForm.subject_code})`}
                    {selectedFeedbackForm.available_until && ` — Available until ${new Date(selectedFeedbackForm.available_until).toLocaleString()}`}
                  </div>
                </div>

                {selectedFormType !== "semester" && (
                  <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#fef3c7", borderRadius: "12px" }}>
                    <strong style={{ display: "block", marginBottom: "8px", color: "#92400e" }}>Topic:</strong>
                    <p style={{ margin: 0, color: "#78350f" }}>{selectedFeedbackForm.subject || "No topic provided"}</p>
                    {selectedFeedbackForm.subject_code && (
                      <p style={{ marginTop: "8px", fontSize: "13px", color: "#92400e" }}>Code: {selectedFeedbackForm.subject_code}</p>
                    )}
                  </div>
                )}

                {isSubjectForm ? (
                  <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ textAlign: "left", padding: "16px", fontWeight: "600", color: "#475569", minWidth: "200px" }}>Criteria</th>
                          {semesterSubjects.map((subject) => {
                            const subjectKey = subject.subject_code || subject.subject;
                            return (
                              <th key={subjectKey} style={{ textAlign: "center", padding: "16px", minWidth: "180px" }}>
                                <select
                                  value={subjectStaffSelections[subjectKey] || ""}
                                  onChange={(e) => handleStaffSelection(subjectKey, e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    marginBottom: "12px"
                                  }}
                                >
                                  <option value="">Select staff</option>
                                  {facultyOptions.map((staff) => (
                                    <option key={staff.username} value={staff.username}>
                                      {staff.first_name || staff.username} {staff.last_name || ''}
                                    </option>
                                  ))}
                                </select>
                                <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>
                                  {subject.subject_code ? `${subject.subject_code}` : subject.subject}
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {currentFeedbackCriteria.map((criterion) => (
                          <tr key={criterion.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ textAlign: "left", padding: "16px", color: "#334155" }}>{criterion.label}</td>
                            {semesterSubjects.map((subject) => {
                              const subjectKey = subject.subject_code || subject.subject;
                              return (
                                <td key={`${subjectKey}-${criterion.key}`} style={{ textAlign: "center", padding: "16px" }}>
                                  <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={feedbackRatings[`${subjectKey}-${criterion.key}`] || ""}
                                    onChange={(e) => handleRatingChange(subjectKey, criterion.key, e.target.value)}
                                    style={{
                                      width: "80px",
                                      padding: "8px",
                                      textAlign: "center",
                                      borderRadius: "8px",
                                      border: "1px solid #cbd5e1"
                                    }}
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
                  <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ textAlign: "left", padding: "16px", fontWeight: "600", color: "#475569" }}>Criteria</th>
                          <th style={{ textAlign: "center", padding: "16px", fontWeight: "600", color: "#475569", width: "150px" }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFeedbackCriteria.map((criterion) => {
                          if (criterion.section) {
                            return (
                              <tr key={`section-${criterion.section}`}>
                                <td colSpan="2" style={{ 
                                  padding: "16px", 
                                  backgroundColor: "#f1f5f9", 
                                  fontWeight: 700, 
                                  color: "#1e293b"
                                }}>
                                  {criterion.section}
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={criterion.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                              <td style={{ textAlign: "left", padding: "16px", color: "#334155" }}>{criterion.label}</td>
                              <td style={{ textAlign: "center", padding: "16px" }}>
                                {criterion.type === "textarea" ? (
                                  <textarea
                                    rows={3}
                                    value={feedbackRatings[criterion.key] || ""}
                                    onChange={(e) => handleRatingChange(null, criterion.key, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "8px",
                                      borderRadius: "8px",
                                      border: "1px solid #cbd5e1",
                                      fontSize: "14px"
                                    }}
                                    placeholder="Write your suggestion"
                                  />
                                ) : (
                                  <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={feedbackRatings[criterion.key] || ""}
                                    onChange={(e) => handleRatingChange(null, criterion.key, e.target.value)}
                                    style={{
                                      width: "80px",
                                      padding: "8px",
                                      textAlign: "center",
                                      borderRadius: "8px",
                                      border: "1px solid #cbd5e1"
                                    }}
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

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#475569" }}>
                    Additional Comments:
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                    placeholder="Write your feedback and suggestions here"
                  />
                </div>

                <button
                  onClick={handleSubmitFeedback}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#5a67d8"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#667eea"}
                >
                  ✨ Submit Feedback
                </button>

                {feedbackStatus && (
                  <div style={{ 
                    marginTop: "16px", 
                    padding: "12px", 
                    backgroundColor: "#d1fae5", 
                    borderRadius: "12px", 
                    color: "#065f46",
                    fontSize: "14px"
                  }}>
                    ✅ {feedbackStatus}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
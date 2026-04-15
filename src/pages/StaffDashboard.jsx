import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [file, setFile] = useState(null);

  const [feedbackForms, setFeedbackForms] = useState([]);
  const [feedbackResults, setFeedbackResults] = useState([]);
  const [loadingFeedbackResults, setLoadingFeedbackResults] = useState(false);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackDepartment, setFeedbackDepartment] = useState("");
  const [feedbackYear, setFeedbackYear] = useState("");
  const [feedbackSection, setFeedbackSection] = useState("");
  const [feedbackSemester, setFeedbackSemester] = useState("");
  const [feedbackType, setFeedbackType] = useState("semester");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackAvailableUntil, setFeedbackAvailableUntil] = useState("");

  const feedbackCategories = [
    { value: "semester", label: "Semester", description: "Feedback for semester courses and faculty." },
    { value: "event", label: "Event", description: "Collect feedback after campus events or workshops." },
    { value: "faculty", label: "Faculty", description: "Evaluate individual faculty members." },
    { value: "general", label: "General", description: "Collect general college or campus feedback." },
  ];

  // Timetable states
  const [timetables, setTimetables] = useState([]);
  const [showTimetableForm, setShowTimetableForm] = useState(false);
  const [timetableDepartment, setTimetableDepartment] = useState("");
  const [timetableYear, setTimetableYear] = useState("");
  const [timetableSection, setTimetableSection] = useState("");
  const [timetableSemester, setTimetableSemester] = useState("");
  const [timetableDay, setTimetableDay] = useState("");
  const [timetablePeriod, setTimetablePeriod] = useState("");
  const [timetableFaculty, setTimetableFaculty] = useState("");
  const [timetableSubjectCode, setTimetableSubjectCode] = useState("");
  const [timetableSubjectName, setTimetableSubjectName] = useState("");
  const [timetableCredits, setTimetableCredits] = useState("");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const designation = localStorage.getItem("designation");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || userRole !== "staff" || (designation !== "faculty_fa" && designation !== "faculty_subject")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("designation");
      navigate("/staff/roles");
    }
  }, [token, userRole, designation, navigate]);

  // Period timings
  const periods = [
    { id: 1, time: "9:00 AM - 9:50 AM", name: "Period 1" },
    { id: 2, time: "9:50 AM - 10:40 AM", name: "Period 2" },
    { id: 3, time: "10:40 AM - 10:55 AM", name: "Interval 1", isBreak: true },
    { id: 4, time: "10:55 AM - 11:45 AM", name: "Period 3" },
    { id: 5, time: "11:45 AM - 12:35 PM", name: "Period 4" },
    { id: 6, time: "12:35 PM - 1:25 PM", name: "Lunch Break", isBreak: true },
    { id: 7, time: "1:25 PM - 2:15 PM", name: "Period 5" },
    { id: 8, time: "2:15 PM - 3:05 PM", name: "Period 6" },
    { id: 9, time: "3:05 PM - 3:20 PM", name: "Interval 2", isBreak: true },
    { id: 10, time: "3:20 PM - 4:10 PM", name: "Period 7" },
    { id: 11, time: "4:10 PM - 5:00 PM", name: "Period 8" },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fetchFeedbackForms = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/feedback-forms/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setFeedbackForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const isNotificationActive = (notification) => {
    if (!notification?.scheduled_time) return true;
    const scheduled = new Date(notification.scheduled_time);
    return !Number.isNaN(scheduled.getTime()) && scheduled >= new Date();
  };

  const filterActiveNotifications = (notifications) =>
    notifications.filter(isNotificationActive);

  const feedbackCriteriaLabels = {
    communication: "Communication Skill",
    explanation: "Explanation of Subject Matter",
    knowledge: "Subject Knowledge",
    engagement: "Ability to Engage Class",
    doubt_clarification: "Doubt Clarification",
    syllabus_coverage: "Syllabus Coverage",
    practical_examples: "Practical Examples",
    industry_relevance: "Industry Relevance",
    skill_development: "Skill Development",
    teaching_pace: "Teaching Pace",
    teaching_aids: "Use of Teaching Aids",
    overall_effectiveness: "Overall Teaching Effectiveness",
    organization: "Event Organization",
    time_management: "Time Management",
    content_quality: "Content Quality",
    speaker_performance: "Speaker Performance",
    audience_engagement: "Audience Engagement",
    venue_arrangement: "Venue Arrangement",
    technical_support: "Technical Support",
    overall_experience: "Overall Experience",
    teaching_clarity: "Teaching Clarity",
    subject_knowledge: "Subject Knowledge",
    student_interaction: "Student Interaction",
    doubt_handling: "Doubt Handling",
    punctuality: "Punctuality",
    fairness: "Fairness",
    approachability: "Approachability",
    class_control: "Class Control",
    guidance: "Guidance & Mentorship",
    overall_performance: "Overall Performance",
    bus_availability: "Bus Availability",
    timing_punctuality: "Timing Punctuality",
    travel_comfort: "Travel Comfort",
    room_cleanliness: "Room Cleanliness",
    water_electricity: "Water & Electricity",
    security: "Security",
    food_quality: "Food Quality",
    food_variety: "Food Variety",
    pricing: "Pricing",
    washroom_cleanliness: "Washroom Cleanliness",
    maintenance_response: "Maintenance Response",
    classroom_cleanliness: "Classroom Cleanliness",
    infrastructure_quality: "Infrastructure Quality",
    campus_maintenance: "Overall Campus Maintenance",
    overall_satisfaction: "Overall Satisfaction",
    suggestions: "Suggestions",
  };

  const getCriterionLabel = (key) => {
    if (!key) return "Unknown";
    return (
      feedbackCriteriaLabels[key] ||
      key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase())
    );
  };

  const parseFeedbackResponseText = (responseText) => {
    if (!responseText) return null;
    if (typeof responseText !== "string") return responseText;
    try {
      return JSON.parse(responseText);
    } catch {
      return null;
    }
  };

  const feedbackCriteriaKeysByType = {
    semester: [
      "communication",
      "explanation",
      "knowledge",
      "engagement",
      "doubt_clarification",
      "syllabus_coverage",
      "practical_examples",
      "industry_relevance",
      "skill_development",
      "teaching_pace",
      "teaching_aids",
      "overall_effectiveness",
    ],
    event: [
      "organization",
      "time_management",
      "content_quality",
      "speaker_performance",
      "audience_engagement",
      "venue_arrangement",
      "technical_support",
      "overall_experience",
    ],
    course: [
      "course_material",
      "assignments",
      "support",
      "difficulty",
      "clarity",
    ],
    faculty: [
      "communication",
      "teaching_clarity",
      "subject_knowledge",
      "student_interaction",
      "doubt_handling",
      "punctuality",
      "fairness",
      "approachability",
      "class_control",
      "guidance",
      "overall_performance",
    ],
    general: [
      "bus_availability",
      "timing_punctuality",
      "travel_comfort",
      "room_cleanliness",
      "water_electricity",
      "security",
      "food_quality",
      "food_variety",
      "pricing",
      "washroom_cleanliness",
      "maintenance_response",
      "classroom_cleanliness",
      "infrastructure_quality",
      "campus_maintenance",
      "overall_satisfaction",
      "suggestions",
    ],
  };

  const getCriteriaKeysByType = (formType) =>
    feedbackCriteriaKeysByType[formType] || feedbackCriteriaKeysByType.semester;

  const fetchFacultyOptions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/available-faculties/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const uniqueFaculty = Array.isArray(data) ? Array.from(
        new Map(data.map((faculty) => [faculty.id, faculty])).values()
      ) : [];
      setFacultyOptions(uniqueFaculty);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeedbackResults = async () => {
    setLoadingFeedbackResults(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/feedback-results/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setFeedbackResults([]);
        return;
      }
      const data = await res.json();
      const uniqueFeedbackResults = Array.isArray(data)
        ? Array.from(
            new Map(
              data.map((form, index) => [form.form_id ?? form.id ?? index, form])
            ).values()
          )
        : [];
      setFeedbackResults(uniqueFeedbackResults);
    } catch (err) {
      console.error(err);
      setFeedbackResults([]);
    } finally {
      setLoadingFeedbackResults(false);
    }
  };

  const handleDeleteFeedbackSummary = async (formId) => {
    if (!window.confirm("Delete all feedback responses for this form? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/delete-feedback-summary/${formId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete feedback summary");
        return;
      }
      alert(data.message || "Feedback summary deleted.");
      fetchFeedbackResults();
    } catch (err) {
      console.error(err);
      alert("Unable to delete feedback summary.");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://127.0.0.1:8000/api/students/submissions/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        alert("Session expired");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      setSubmissions(
        data.map((s) => ({
          ...s,
          marks: s.marks || "",
          feedback: s.feedback || "",
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/api/students/notifications/",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setNotifications(Array.isArray(data) ? filterActiveNotifications(data) : []);
  };

  const fetchTimetables = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/timetables/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setTimetables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTimetable = async () => {
    if (!timetableDepartment || !timetableYear || !timetableSection || !timetableSemester || 
        !timetableDay || !timetablePeriod || !timetableFaculty || !timetableSubjectCode || 
        !timetableSubjectName || !timetableCredits) {
      alert("Please fill all timetable fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/students/create-timetable/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: timetableDepartment,
          year: timetableYear,
          section: timetableSection,
          semester: timetableSemester,
          day: timetableDay,
          period: timetablePeriod,
          faculty_id: timetableFaculty,
          subject_code: timetableSubjectCode,
          subject_name: timetableSubjectName,
          credits: parseInt(timetableCredits),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create timetable entry");
        return;
      }
      alert("Timetable entry created successfully");
      setTimetableDepartment("");
      setTimetableYear("");
      setTimetableSection("");
      setTimetableSemester("");
      setTimetableDay("");
      setTimetablePeriod("");
      setTimetableFaculty("");
      setTimetableSubjectCode("");
      setTimetableSubjectName("");
      setTimetableCredits("");
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Unable to create timetable entry");
    }
  };

  const handleDeleteTimetable = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/delete-timetable/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete timetable entry");
        return;
      }
      alert("Timetable entry deleted");
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Unable to delete timetable entry");
    }
  };

  // ✅ CREATE NOTIFICATION
  const handleCreateNotification = async () => {
    if (title.length < 5 || message.length < 10) {
      alert("Enter proper title and message");
      return;
    }

    if (!department || !year || !section) {
      alert("Select department, year and section");
      return;
    }

    const token = localStorage.getItem("token");

    const scheduledTimeValue = scheduledTime
      ? new Date(scheduledTime).toISOString()
      : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("department", department);
    formData.append("year", year);
    formData.append("section", section);
    formData.append("scheduled_time", scheduledTimeValue);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(
      "http://127.0.0.1:8000/api/students/create-notification/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Notification sent");

    setTitle("");
    setMessage("");
    setDepartment("");
    setYear("");
    setSection("");
    setScheduledTime("");
    setFile(null);

    fetchNotifications();
  };

  const handleCreateFeedbackForm = async () => {
    if (!feedbackDescription.trim()) {
      alert("Please enter feedback description");
      return;
    }

    if (!feedbackDepartment || !feedbackYear || !feedbackSection || !feedbackSemester) {
      alert("Please select Department, Year, Section, and Semester for this feedback form");
      return;
    }

    if (!feedbackSubject.trim()) {
      alert("Please enter the feedback topic or title");
      return;
    }

    try {
      const availableUntilValue = feedbackAvailableUntil
        ? new Date(feedbackAvailableUntil).toISOString()
        : null;

      const payload = {
        title: `${feedbackCategories.find((category) => category.value === feedbackType)?.label || "Feedback"} Feedback`,
        description: feedbackDescription,
        form_type: feedbackType,
        department: feedbackDepartment,
        year: feedbackYear,
        section: feedbackSection,
        semester: feedbackSemester,
        subject: feedbackSubject,
        available_until: availableUntilValue,
      };

      const res = await fetch("http://127.0.0.1:8000/api/students/create-feedback-form/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create feedback form");
        return;
      }
      alert("Feedback form created");
      setFeedbackDescription("");
      setFeedbackDepartment("");
      setFeedbackYear("");
      setFeedbackSection("");
      setFeedbackSemester("");
      setFeedbackType("semester");
      setFeedbackSubject("");
      setFeedbackAvailableUntil("");
      fetchFeedbackForms();
    } catch (err) {
      console.error(err);
      alert("Unable to create feedback form");
    }
  };

  const handleDeleteFeedbackForm = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/delete-feedback-form/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete feedback form");
        return;
      }
      alert("Feedback form deleted");
      fetchFeedbackForms();
    } catch (err) {
      console.error(err);
      alert("Unable to delete feedback form");
    }
  };

  // 🔥 REPLACED DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/students/delete-notification/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        alert("Session expired");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete notification");
        return;
      }

      alert("Notification deleted");
      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("Unable to delete notification");
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchNotifications();
    fetchFeedbackForms();
    fetchFeedbackResults();
    fetchFacultyOptions();
    fetchTimetables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const feedbackSummaryForms = feedbackResults.filter(
    (form) => Array.isArray(form.responses) && form.responses.length > 0
  );

  const handleChange = (id, field, value) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleGrade = async (id, marks, feedback) => {
    if (!marks) return alert("Enter marks");

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/api/students/grade/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submission_id: id, marks, feedback }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Graded");
    fetchSubmissions();
  };

  return (
    <div>
      <h1>Staff Dashboard - Submissions</h1>

      <h2>Create Notification</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />

      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        <option value="all">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
        <option value="MECH">MECH</option>
      </select>

      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        <option value="all">All Years</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <select value={section} onChange={(e) => setSection(e.target.value)}>
        <option value="">Select Section</option>
        <option value="all">All Sections</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>

      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleCreateNotification}>Send</button>

      {/* Timetable Section */}
      <section style={{ marginTop: "24px", marginBottom: "24px", borderTop: "2px solid #ccc", paddingTop: "20px" }}>
        <h2>Class Timetable Management</h2>
        <button 
          onClick={() => setShowTimetableForm(!showTimetableForm)}
          style={{ marginBottom: "16px", padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {showTimetableForm ? "Hide Timetable Form" : "Add Timetable Entry"}
        </button>

        {showTimetableForm && (
          <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
            <div style={{ marginBottom: "16px", padding: "12px", background: "#eef6ff", borderRadius: "8px" }}>
              <strong>Tip:</strong> If you want to see the full staff list, visit the <a href="/admin/dashboard">Admin page</a>.
            </div>
            <h3>Create Timetable Entry</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Department:</label>
                <select 
                  value={timetableDepartment} 
                  onChange={(e) => setTimetableDepartment(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Year:</label>
                <select 
                  value={timetableYear} 
                  onChange={(e) => setTimetableYear(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Section:</label>
                <select 
                  value={timetableSection} 
                  onChange={(e) => setTimetableSection(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Semester:</label>
                <select 
                  value={timetableSemester} 
                  onChange={(e) => setTimetableSemester(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Semester</option>
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
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Day:</label>
                <select 
                  value={timetableDay} 
                  onChange={(e) => setTimetableDay(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Period:</label>
                <select 
                  value={timetablePeriod} 
                  onChange={(e) => setTimetablePeriod(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Period</option>
                  {periods.filter(p => !p.isBreak).map(period => (
                    <option key={period.id} value={period.id}>
                      {period.name} ({period.time})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Faculty:</label>
                <select 
                  value={timetableFaculty} 
                  onChange={(e) => setTimetableFaculty(e.target.value)}
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                >
                  <option value="">Select Faculty</option>
                  {facultyOptions.map((faculty) => {
                    const label = faculty.full_name || faculty.username;
                    return (
                      <option key={faculty.id} value={faculty.id}>
                        {label}{faculty.designation ? ` — ${faculty.designation}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Subject Code:</label>
                <input
                  type="text"
                  value={timetableSubjectCode}
                  onChange={(e) => setTimetableSubjectCode(e.target.value)}
                  placeholder="e.g., CS101"
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Subject Name:</label>
                <input
                  type="text"
                  value={timetableSubjectName}
                  onChange={(e) => setTimetableSubjectName(e.target.value)}
                  placeholder="Subject Name"
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Credits:</label>
                <input
                  type="number"
                  value={timetableCredits}
                  onChange={(e) => setTimetableCredits(e.target.value)}
                  placeholder="Credits"
                  style={{ width: "100%", padding: "6px", fontSize: "13px" }}
                />
              </div>
            </div>

            <button onClick={handleCreateTimetable} style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Create Timetable Entry
            </button>
          </div>
        )}

        <h3>Existing Timetable Entries</h3>
        {timetables.length === 0 ? (
          <p>No timetable entries created yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Semester</th>
                  <th>Day</th>
                  <th>Period</th>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Faculty</th>
                  <th>Credits</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timetables.map((t) => {
                  const periodInfo = periods.find(p => p.id === parseInt(t.period));
                  return (
                    <tr key={t.id}>
                      <td>{t.department}</td>
                      <td>{t.year}</td>
                      <td>{t.section}</td>
                      <td>{t.semester}</td>
                      <td>{t.day}</td>
                      <td>
                        {periodInfo ? periodInfo.name : `Period ${t.period}`}
                        <br/>
                        <small>{periodInfo ? periodInfo.time : ""}</small>
                      </td>
                      <td>{t.subject_code}</td>
                      <td>{t.subject_name}</td>
                      <td>{t.faculty_name || t.faculty?.first_name || "Unknown"}</td>
                      <td>{t.credits}</td>
                      <td>
                        <button onClick={() => handleDeleteTimetable(t.id)} style={{ padding: "4px 8px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginTop: "24px", marginBottom: "24px" }}>
        <h2>Create Feedback Form</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
          {feedbackCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFeedbackType(category.value)}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: feedbackType === category.value ? "2px solid #1a73e8" : "1px solid #ccc",
                background: feedbackType === category.value ? "#e8f0fe" : "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong>{category.label}</strong>
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#555" }}>{category.description}</p>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "8px" }}>
          <textarea
            value={feedbackDescription}
            onChange={(e) => setFeedbackDescription(e.target.value)}
            placeholder="Feedback Description"
            rows={4}
            style={{ width: "100%", padding: "8px", fontSize: "14px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "8px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
              {feedbackType === "event"
                ? "Event Title"
                : feedbackType === "faculty"
                ? "Faculty / Topic"
                : feedbackType === "general"
                ? "General Topic"
                : "Semester Topic"}
            </label>
            <input
              value={feedbackSubject}
              onChange={(e) => setFeedbackSubject(e.target.value)}
              placeholder={
                feedbackType === "event"
                  ? "Enter the event name"
                  : feedbackType === "faculty"
                  ? "Enter the faculty name or topic"
                  : feedbackType === "general"
                  ? "Enter the feedback topic"
                  : "Enter the semester feedback title"
              }
              style={{ width: "100%", padding: "8px", fontSize: "14px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Feedback Expiry</label>
          <input
            type="datetime-local"
            value={feedbackAvailableUntil}
            onChange={(e) => setFeedbackAvailableUntil(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "14px" }}
          />
          <small style={{ color: "#555" }}>Optional: make this form available until a specific date/time.</small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Department:</label>
            <select 
              value={feedbackDepartment} 
              onChange={(e) => setFeedbackDepartment(e.target.value)}
              style={{ width: "100%", padding: "6px", fontSize: "13px" }}
            >
              <option value="">Select Dept</option>
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Year:</label>
            <select 
              value={feedbackYear} 
              onChange={(e) => setFeedbackYear(e.target.value)}
              style={{ width: "100%", padding: "6px", fontSize: "13px" }}
            >
              <option value="">Select Year</option>
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Section:</label>
            <select 
              value={feedbackSection} 
              onChange={(e) => setFeedbackSection(e.target.value)}
              style={{ width: "100%", padding: "6px", fontSize: "13px" }}
            >
              <option value="">Select Section</option>
              <option value="all">All Sections</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Semester:</label>
            <select 
              value={feedbackSemester} 
              onChange={(e) => setFeedbackSemester(e.target.value)}
              style={{ width: "100%", padding: "6px", fontSize: "13px" }}
            >
              <option value="">Select Semester</option>
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
        </div>
         
        <button onClick={handleCreateFeedbackForm}>Create Feedback Form</button>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>Student Comments Dashboard</h2>
        <p style={{ marginBottom: "12px" }}>
          Select a feedback category below to view only comments for that category. Student identities are hidden.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                {feedbackCategories.map((category) => (
                  <th key={category.value} style={{ padding: "10px", textAlign: "center" }}>
                    {category.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {feedbackCategories.map((category) => (
                  <td key={category.value} style={{ padding: "12px", textAlign: "center" }}>
                    <Link
                      to={`/staff/comments/${category.value}`}
                      style={{
                        display: "inline-block",
                        padding: "10px 16px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        borderRadius: "6px",
                        textDecoration: "none",
                      }}
                    >
                      View {category.label} Comments
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>Feedback Response Summary</h2>
        {loadingFeedbackResults ? (
          <p>Loading feedback results...</p>
        ) : !Array.isArray(feedbackSummaryForms) || feedbackSummaryForms.length === 0 ? (
          <p>No aggregated feedback available yet.</p>
        ) : (
          feedbackSummaryForms.map((form, formIndex) => {
            const formType = form.form_type || "semester";
            const criteriaKeys = getCriteriaKeysByType(formType).filter((key) => key !== "suggestions");
            const formKey = form.form_id ?? form.id ?? `feedback-form-${formIndex}`;
            const responses = Array.isArray(form.responses) ? form.responses : [];

            const grouped = {};
            const addRow = (groupKey, row) => {
              if (!grouped[groupKey]) {
                grouped[groupKey] = { ...row, count: 0, sums: {} };
              }
              grouped[groupKey].count += 1;
              criteriaKeys.forEach((key) => {
                const value = Number(row.ratings?.[key]);
                if (!Number.isNaN(value)) {
                  grouped[groupKey].sums[key] = (grouped[groupKey].sums[key] || 0) + value;
                }
              });
            };

            responses.forEach((response) => {
              const parsed = parseFeedbackResponseText(response.response || response.response_text);
              if (!parsed) return;

              if (formType === "faculty") {
                addRow(
                  form.faculty_username || parsed.target_faculty || "Unknown",
                  {
                    key: `${formKey}-faculty`,
                    label: form.faculty_username || parsed.target_faculty || "Unknown",
                    ratings: parsed.ratings || {},
                  }
                );
                return;
              }

              if (Array.isArray(parsed.subject_staff_ratings) && parsed.subject_staff_ratings.length > 0) {
                parsed.subject_staff_ratings.forEach((subjectRating) => {
                  const label = `${subjectRating.subject || subjectRating.subject_code || "Subject"}`;
                  addRow(
                    `${label}-${subjectRating.faculty_username || "Unknown"}`,
                    {
                      key: `${formKey}-${label}-${subjectRating.faculty_username || "Unknown"}`,
                      label,
                      faculty: subjectRating.faculty_username || "",
                      ratings: subjectRating.ratings || {},
                    }
                  );
                });
                return;
              }

              if (parsed.ratings && typeof parsed.ratings === "object") {
                addRow(
                  formType === "semester" || formType === "course"
                    ? form.subject || parsed.topic || `Form ${formIndex + 1}`
                    : form.title || parsed.topic || `Form ${formIndex + 1}`,
                  {
                    key: `${formKey}-overall`,
                    label: formType === "semester" || formType === "course" ? form.subject || parsed.topic || "Subject" : form.title || parsed.topic || "Form",
                    faculty: formType === "faculty" ? form.faculty_username || parsed.target_faculty || "" : parsed.target_faculty || form.faculty_username || "",
                    ratings: parsed.ratings || {},
                  }
                );
                return;
              }
            });

            const summaryRows = Object.values(grouped).map((entry) => ({
              ...entry,
              averageRatings: criteriaKeys.reduce((acc, key) => {
                acc[key] = entry.count > 0 && entry.sums[key] !== undefined ? Number((entry.sums[key] / entry.count).toFixed(1)) : "-";
                return acc;
              }, {}),
            }));

            if (summaryRows.length === 0) {
              return (
                <div key={formKey} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "16px" }}>
                  <strong>{form.title}</strong>
                  <p style={{ margin: "6px 0" }}>No aggregated feedback available.</p>
                </div>
              );
            }

            return (
              <div key={formKey} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <strong>{form.title}</strong>
                  <button
                    onClick={() => handleDeleteFeedbackSummary(form.form_id ?? form.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Summary
                  </button>
                </div>
                <p style={{ margin: "6px 0" }}>
                  Type: {formType === "event" ? "Event" : formType === "faculty" ? "Faculty" : formType === "general" ? "General" : "Semester"} Feedback
                  {form.semester ? ` • Semester ${form.semester}` : ""}
                  {form.department && form.department !== "all" ? ` • ${form.department}` : ""}
                  {form.year && form.year !== "all" ? ` • Year ${form.year}` : ""}
                  {form.section && form.section !== "all" ? ` • Section ${form.section}` : ""}
                </p>
                <p style={{ margin: "6px 0" }}>Responses: {form.total_responses ?? responses.length}</p>
                <div style={{ overflowX: "auto" }}>
                  <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ padding: "10px" }}>{formType === "faculty" ? "Staff" : formType === "semester" || formType === "course" ? "Subject" : "Feedback"}</th>
                        {formType !== "faculty" && <th style={{ padding: "10px" }}>Faculty</th>}
                        {criteriaKeys.map((key) => (
                          <th key={key} style={{ padding: "10px" }}>{getCriterionLabel(key)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map((row) => (
                        <tr key={row.key}>
                          <td style={{ padding: "10px" }}>{row.label}</td>
                          {formType !== "faculty" && <td style={{ padding: "10px" }}>{row.faculty || "-"}</td>}
                          {criteriaKeys.map((key) => (
                            <td key={key} style={{ padding: "10px", textAlign: "center" }}>{row.averageRatings[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2>Existing Feedback Forms</h2>
        {feedbackForms.length === 0 ? (
          <p>No feedback forms created yet.</p>
        ) : (
          feedbackForms.map((form) => (
            <div key={form.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
              <strong>{form.title}</strong>
              <p>{form.description}</p>
              <p>
                Type: {form.form_type || form.feedback_type || "Semester Feedback"}
                {form.semester ? " - Semester " + form.semester : ""}
                {form.department && form.department !== "all" ? ", " + form.department : ""}
                {form.year && form.year !== "all" ? " " + form.year : ""}
                {form.section && form.section !== "all" ? " " + form.section : ""}
              </p>
              {form.available_until && (
                <p>Available until: {new Date(form.available_until).toLocaleString()}</p>
              )}
              <button onClick={() => handleDeleteFeedbackForm(form.id)}>
                Delete Feedback Form
              </button>
            </div>
          ))
        )}
      </section>

      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id}>
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

            <button onClick={() => handleDelete(n.id)}>Delete</button>

            <hr />
          </div>
        ))
      )}

      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>File</th>
            <th>Submitted At</th>
            <th>Marks</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.student_name}</td>
              <td>{s.subject}</td>
              <td>
                <a
                  href={`http://127.0.0.1:8000${s.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View File
                </a>
               </td>
              <td>{s.submitted_at}</td>

              <td>
                <input
                  type="number"
                  value={s.marks}
                  onChange={(e) =>
                    handleChange(s.id, "marks", e.target.value)
                  }
                  style={{ width: "80px", padding: "4px" }}
                />
               </td>

              <td>
                <input
                  type="text"
                  value={s.feedback}
                  onChange={(e) =>
                    handleChange(s.id, "feedback", e.target.value)
                  }
                  style={{ width: "150px", padding: "4px" }}
                />
               </td>

              <td>
                <button
                  onClick={() =>
                    handleGrade(s.id, s.marks, s.feedback)
                  }
                  style={{ padding: "4px 8px" }}
                >
                  Submit
                </button>
               </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
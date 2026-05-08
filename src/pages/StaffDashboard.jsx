import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { normalizeToken } from "../services/api";

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
  const [editingTimetableId, setEditingTimetableId] = useState(null);
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);

  const token = normalizeToken(localStorage.getItem("token"));
  const userRole = localStorage.getItem("role");
  const designation = localStorage.getItem("designation");
  const savedDepartment = localStorage.getItem("department") || "";
  const savedYear = localStorage.getItem("year") || "";
  const savedSection = localStorage.getItem("section") || "";
  const isFacultyFA = designation === "faculty_fa";
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || userRole !== "staff") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("designation");
      navigate("/staff/roles");
    }
  }, [token, userRole, navigate]);

  useEffect(() => {
    if (isFacultyFA) {
      setDepartment(savedDepartment);
      setYear(savedYear);
      setSection(savedSection);
      setFeedbackDepartment(savedDepartment);
      setFeedbackYear(savedYear);
      setFeedbackSection(savedSection);
      setTimetableDepartment(savedDepartment);
      setTimetableYear(savedYear);
      setTimetableSection(savedSection);
    }
  }, [isFacultyFA, savedDepartment, savedYear, savedSection]);

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
      const token = normalizeToken(localStorage.getItem("token"));

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
    const token = normalizeToken(localStorage.getItem("token"));

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

  const handleSubmitTimetable = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/submit-timetable/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to submit timetable entry");
        return;
      }
      alert("Timetable entry submitted for HOD review");
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Unable to submit timetable entry");
    }
  };

  const resetTimetableForm = () => {
    setEditingTimetableId(null);
    setIsEditingTimetable(false);
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
  };

  const handleEditTimetable = (timetable) => {
    setShowTimetableForm(true);
    setIsEditingTimetable(true);
    setEditingTimetableId(timetable.id);
    setTimetableDepartment(timetable.department || "");
    setTimetableYear(timetable.year || "");
    setTimetableSection(timetable.section || "");
    setTimetableSemester(timetable.semester || "");
    setTimetableDay(timetable.day || "");
    setTimetablePeriod(timetable.period || "");
    setTimetableFaculty(timetable.faculty_id || "");
    setTimetableSubjectCode(timetable.subject_code || "");
    setTimetableSubjectName(timetable.subject || "");
    setTimetableCredits(timetable.credits || "");
  };

  const handleUpdateTimetable = async () => {
    if (!editingTimetableId) {
      alert("No timetable entry selected for editing");
      return;
    }

    if (!timetableDepartment || !timetableYear || !timetableSection || !timetableSemester ||
        !timetableDay || !timetablePeriod || !timetableFaculty || !timetableSubjectCode ||
        !timetableSubjectName || !timetableCredits) {
      alert("Please fill all timetable fields");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/update-timetable/${editingTimetableId}/`, {
        method: "PUT",
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
          credits: parseInt(timetableCredits, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update timetable entry");
        return;
      }
      alert("Timetable entry updated successfully");
      resetTimetableForm();
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Unable to update timetable entry");
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

    const token = normalizeToken(localStorage.getItem("token"));

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
      const token = normalizeToken(localStorage.getItem("token"));

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

    const token = normalizeToken(localStorage.getItem("token"));

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
        <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>👨‍🏫 Staff Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Manage submissions, notifications, feedback, and timetable</p>
      </div>

      {/* Create Notification Section */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📢 Create Notification</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "16px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            rows={3}
            style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: isFacultyFA ? "#f1f5f9" : "white" }}>
            <option value="">Select Department</option>
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: isFacultyFA ? "#f1f5f9" : "white" }}>
            <option value="">Select Year</option>
            <option value="all">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select value={section} onChange={(e) => setSection(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: isFacultyFA ? "#f1f5f9" : "white" }}>
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
            style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}
          />

          <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ padding: "10px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
        </div>

        <button onClick={handleCreateNotification} style={{ padding: "12px 24px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
          📤 Send Notification
        </button>
      </div>

      {/* Timetable Section */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📅 Timetable Management</h2>
          <button 
            onClick={() => setShowTimetableForm(!showTimetableForm)}
            style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "500" }}
          >
            {showTimetableForm ? "− Hide Form" : "+ Add Timetable Entry"}
          </button>
        </div>

        {showTimetableForm && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "32px", backgroundColor: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>{isEditingTimetable ? "✏️ Edit Timetable Entry" : "➕ Create Timetable Entry"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Department:</label>
                <select value={timetableDepartment} onChange={(e) => setTimetableDepartment(e.target.value)} disabled={isFacultyFA} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Year:</label>
                <select value={timetableYear} onChange={(e) => setTimetableYear(e.target.value)} disabled={isFacultyFA} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Section:</label>
                <select value={timetableSection} onChange={(e) => setTimetableSection(e.target.value)} disabled={isFacultyFA} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Semester:</label>
                <select value={timetableSemester} onChange={(e) => setTimetableSemester(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Day:</label>
                <select value={timetableDay} onChange={(e) => setTimetableDay(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Period:</label>
                <select value={timetablePeriod} onChange={(e) => setTimetablePeriod(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Period</option>
                  {periods.filter(p => !p.isBreak).map(period => (
                    <option key={period.id} value={period.id}>{period.name} ({period.time})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Faculty:</label>
                <select value={timetableFaculty} onChange={(e) => setTimetableFaculty(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <option value="">Select Faculty</option>
                  {facultyOptions.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>{faculty.full_name || faculty.username}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Subject Code:</label>
                <input type="text" value={timetableSubjectCode} onChange={(e) => setTimetableSubjectCode(e.target.value)} placeholder="e.g., CS101" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>
              
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Subject Name:</label>
                <input type="text" value={timetableSubjectName} onChange={(e) => setTimetableSubjectName(e.target.value)} placeholder="Subject Name" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px", color: "#475569" }}>Credits:</label>
                <input type="number" value={timetableCredits} onChange={(e) => setTimetableCredits(e.target.value)} placeholder="Credits" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={isEditingTimetable ? handleUpdateTimetable : handleCreateTimetable} style={{ padding: "10px 24px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "500" }}>
                {isEditingTimetable ? "💾 Save Changes" : "✨ Create Entry"}
              </button>
              {isEditingTimetable && (
                <button onClick={resetTimetableForm} style={{ padding: "10px 24px", backgroundColor: "#64748b", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "500" }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1e293b" }}>📋 Existing Timetable Entries</h3>
        {timetables.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b" }}>No timetable entries created yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Dept</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Year</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Sec</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Sem</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Day</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Period</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Code</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Subject</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Faculty</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Credits</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetables.map((t) => {
                  const periodInfo = periods.find(p => p.id === parseInt(t.period));
                  const statusColors = {
                    approved: "#10b981",
                    draft: "#f59e0b",
                    rejected: "#ef4444",
                    rework_assigned: "#8b5cf6"
                  };
                  const statusColor = statusColors[t.approval_status] || "#64748b";
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.department}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.year}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.section}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.semester}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.day}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{periodInfo ? periodInfo.name : `Period ${t.period}`}</td>
                      <td style={{ padding: "12px", color: "#334155", fontWeight: "500" }}>{t.subject_code}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.subject || t.subject_name}</td>
                      <td style={{ padding: "12px", color: "#667eea" }}>{t.faculty || "Unknown"}</td>
                      <td style={{ padding: "12px", color: "#334155" }}>{t.credits}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "12px", 
                          fontWeight: "600",
                          backgroundColor: statusColor + "20",
                          color: statusColor
                        }}>
                          {t.approval_status || (t.is_approved ? 'approved' : 'draft')}
                        </span>
                      </td>
                      <td style={{ padding: "12px", display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {t.approval_status !== 'approved' && (
                          <button onClick={() => handleEditTimetable(t)} style={{ padding: "6px 12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                            Edit
                          </button>
                        )}
                        {['draft', 'rejected', 'rework_assigned'].includes(t.approval_status) && (
                          <button onClick={() => handleSubmitTimetable(t.id)} style={{ padding: "6px 12px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                            Submit
                          </button>
                        )}
                        <button onClick={() => handleDeleteTimetable(t.id)} style={{ padding: "6px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
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
      </div>

      {/* Create Feedback Form Section */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📊 Create Feedback Form</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {feedbackCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFeedbackType(category.value)}
              style={{
                padding: "16px",
                borderRadius: "16px",
                border: feedbackType === category.value ? "2px solid #667eea" : "1px solid #e2e8f0",
                background: feedbackType === category.value ? "#eef2ff" : "#f8fafc",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease"
              }}
            >
              <strong style={{ color: "#1e293b" }}>{category.label}</strong>
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#64748b" }}>{category.description}</p>
            </button>
          ))}
        </div>

        <textarea
          value={feedbackDescription}
          onChange={(e) => setFeedbackDescription(e.target.value)}
          placeholder="Feedback Description"
          rows={3}
          style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "16px" }}
        />

        <input
          value={feedbackSubject}
          onChange={(e) => setFeedbackSubject(e.target.value)}
          placeholder={
            feedbackType === "event" ? "Event Title" :
            feedbackType === "faculty" ? "Faculty / Topic" :
            feedbackType === "general" ? "General Topic" : "Semester Topic"
          }
          style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "16px" }}
        />

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#475569" }}>Feedback Expiry (Optional)</label>
          <input
            type="datetime-local"
            value={feedbackAvailableUntil}
            onChange={(e) => setFeedbackAvailableUntil(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          <select value={feedbackDepartment} onChange={(e) => setFeedbackDepartment(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <option value="">Select Dept</option>
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>
          
          <select value={feedbackYear} onChange={(e) => setFeedbackYear(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <option value="">Select Year</option>
            <option value="all">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          
          <select value={feedbackSection} onChange={(e) => setFeedbackSection(e.target.value)} disabled={isFacultyFA} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <option value="">Select Section</option>
            <option value="all">All Sections</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          
          <select value={feedbackSemester} onChange={(e) => setFeedbackSemester(e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
         
        <button onClick={handleCreateFeedbackForm} style={{ padding: "12px 24px", backgroundColor: "#667eea", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
          ✨ Create Feedback Form
        </button>
      </div>

      {/* Comments Dashboard */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>💬 Student Comments Dashboard</h2>
        <p style={{ marginBottom: "20px", color: "#64748b" }}>Select a feedback category to view comments. Student identities are hidden.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {feedbackCategories.map((category) => (
            <Link
              key={category.value}
              to={`/staff/comments/${category.value}`}
              style={{
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                textDecoration: "none",
                textAlign: "center",
                fontWeight: "600",
                color: "#667eea",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#eef2ff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📝 {category.label} Comments
            </Link>
          ))}
        </div>
      </div>

      {/* Feedback Response Summary */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📊 Feedback Response Summary</h2>
        {loadingFeedbackResults ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading feedback results...</p>
        ) : !Array.isArray(feedbackSummaryForms) || feedbackSummaryForms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b" }}>No aggregated feedback available yet.</p>
          </div>
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
                <div key={formKey} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                  <strong style={{ fontSize: "16px", color: "#1e293b" }}>{form.title}</strong>
                  <p style={{ margin: "8px 0 0", color: "#64748b" }}>No aggregated feedback available.</p>
                </div>
              );
            }

            return (
              <div key={formKey} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                  <strong style={{ fontSize: "16px", color: "#1e293b" }}>{form.title}</strong>
                  <button
                    onClick={() => handleDeleteFeedbackSummary(form.form_id ?? form.id)}
                    style={{
                      padding: "6px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px"
                    }}
                  >
                    🗑️ Delete Summary
                  </button>
                </div>
                <p style={{ margin: "6px 0", fontSize: "13px", color: "#64748b" }}>
                  Type: {formType === "event" ? "Event" : formType === "faculty" ? "Faculty" : formType === "general" ? "General" : "Semester"} Feedback
                  {form.semester ? ` • Semester ${form.semester}` : ""}
                  {form.department && form.department !== "all" ? ` • ${form.department}` : ""}
                  {form.year && form.year !== "all" ? ` • Year ${form.year}` : ""}
                  {form.section && form.section !== "all" ? ` • Section ${form.section}` : ""}
                </p>
                <p style={{ margin: "6px 0 16px", fontSize: "13px", color: "#64748b" }}>Responses: {form.total_responses ?? responses.length}</p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                        <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>{formType === "faculty" ? "Staff" : formType === "semester" || formType === "course" ? "Subject" : "Feedback"}</th>
                        {formType !== "faculty" && <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Faculty</th>}
                        {criteriaKeys.map((key) => (
                          <th key={key} style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: "#475569" }}>{getCriterionLabel(key)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map((row) => (
                        <tr key={row.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "12px", color: "#334155" }}>{row.label}</td>
                          {formType !== "faculty" && <td style={{ padding: "12px", color: "#667eea" }}>{row.faculty || "-"}</td>}
                          {criteriaKeys.map((key) => (
                            <td key={key} style={{ padding: "12px", textAlign: "center", fontWeight: "500", color: "#1e293b" }}>{row.averageRatings[key]}</td>
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
      </div>

      {/* Existing Feedback Forms */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📋 Existing Feedback Forms</h2>
        {feedbackForms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b" }}>No feedback forms created yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {feedbackForms.map((form) => (
              <div key={form.id} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", backgroundColor: "#fafcff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", color: "#1e293b" }}>{form.title}</strong>
                    <p style={{ margin: "8px 0", color: "#475569" }}>{form.description}</p>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#64748b" }}>
                      Type: {form.form_type || form.feedback_type || "Semester Feedback"}
                      {form.semester ? ` - Semester ${form.semester}` : ""}
                      {form.department && form.department !== "all" ? `, ${form.department}` : ""}
                      {form.year && form.year !== "all" ? ` Year ${form.year}` : ""}
                      {form.section && form.section !== "all" ? ` Section ${form.section}` : ""}
                    </p>
                    {form.available_until && (
                      <p style={{ margin: "4px 0", fontSize: "12px", color: "#f59e0b" }}>Available until: {new Date(form.available_until).toLocaleString()}</p>
                    )}
                  </div>
                  <button onClick={() => handleDeleteFeedbackForm(form.id)} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    Delete Form
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <p style={{ color: "#64748b" }}>No notifications</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", backgroundColor: "#fafcff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", color: "#1e293b" }}>{n.title}</strong>
                    <p style={{ margin: "8px 0", color: "#475569" }}>{n.message}</p>
                    {n.file && (
                      <a href={`http://127.0.0.1:8000${n.file}`} target="_blank" rel="noreferrer" style={{ color: "#667eea", textDecoration: "none", fontSize: "14px" }}>
                        📎 View File
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDelete(n.id)} style={{ padding: "6px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Submissions */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "20px", 
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "600", color: "#1e293b" }}>📝 Student Submissions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Student</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Subject</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>File</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Submitted At</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Marks</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Feedback</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, idx) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "white" : "#fafcff" }}>
                  <td style={{ padding: "12px", color: "#334155" }}>{s.student_name}</td>
                  <td style={{ padding: "12px", color: "#334155" }}>{s.subject}</td>
                  <td style={{ padding: "12px" }}>
                    <a href={`http://127.0.0.1:8000${s.file}`} target="_blank" rel="noreferrer" style={{ color: "#667eea", textDecoration: "none" }}>
                      📄 View File
                    </a>
                  </td>
                  <td style={{ padding: "12px", color: "#64748b", fontSize: "14px" }}>{s.submitted_at}</td>
                  <td style={{ padding: "12px" }}>
                    <input type="number" value={s.marks} onChange={(e) => handleChange(s.id, "marks", e.target.value)} style={{ width: "80px", padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <input type="text" value={s.feedback} onChange={(e) => handleChange(s.id, "feedback", e.target.value)} style={{ width: "150px", padding: "8px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => handleGrade(s.id, s.marks, s.feedback)} style={{ padding: "6px 16px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      Submit Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
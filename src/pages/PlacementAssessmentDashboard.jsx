import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const initialDepartments = [];

function getTotal(student) {
  return [student.aptitudeMarks, student.codingMarks, student.mockMarks].reduce(
    (sum, value) => sum + (typeof value === "number" ? value : 0),
    0
  );
}

function getNeedImprovementReason(student) {
  const categories = [];
  if (student.aptitudeMarks < 80) categories.push("Aptitude");
  if (student.codingMarks < 80) categories.push("Coding");
  if (student.mockMarks < 80) categories.push("Mock Interview");
  return categories.length ? categories.join(", ") : "";
}

export default function PlacementAssessmentDashboard() {
  const navigate = useNavigate();
  const { department: selectedDeptFromUrl } = useParams();
  const [departments, setDepartments] = useState(initialDepartments);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [resultsPublished, setResultsPublished] = useState(false);
  const [modalType, setModalType] = useState("");
  const [monitoringAllowed, setMonitoringAllowed] = useState(false);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [monitorLogs, setMonitorLogs] = useState([]);
  const [assessmentStartAt, setAssessmentStartAt] = useState(null);
  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    const savedAptitude = localStorage.getItem("placement_aptitude_questions");
    const savedCoding = localStorage.getItem("placement_coding_questions");
    const savedMock = localStorage.getItem("placement_mock_questions");
    const savedPublished = localStorage.getItem("placement_results_published");
    const savedStart = localStorage.getItem("placement_assessment_start_at");

    if (savedAptitude) setAptitudeQuestions(JSON.parse(savedAptitude));
    if (savedCoding) setCodingQuestions(JSON.parse(savedCoding));
    if (savedMock) setMockQuestions(JSON.parse(savedMock));
    if (savedPublished === "true") setResultsPublished(true);
    if (savedStart) setAssessmentStartAt(Number(savedStart));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFetchError("Authentication token not found. Please login again.");
      setIsLoadingStudents(false);
      return;
    }

    const loadStudentData = async () => {
      try {
        const departmentResponse = await API.get("api/students/placement/departments/", null, token);
        const departmentCodes = Array.isArray(departmentResponse) ? departmentResponse.map((dept) => dept.code).filter(Boolean) : [];
        setDepartments(departmentCodes);

        const departmentStudentLists = await Promise.all(
          departmentCodes.map(async (code) => {
            try {
              const response = await API.get(`api/students/placement/students/${encodeURIComponent(code)}/`, null, token);
              const students = Array.isArray(response.students) ? response.students : [];
              return students.map((student) => ({ ...student, dept: code }));
            } catch (error) {
              console.error(`Failed to load students for ${code}`, error);
              return [];
            }
          })
        );

        const combinedStudents = departmentStudentLists.flat().map((student) => ({
          id: student.id,
          name: student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim(),
          registerNo: student.register_number || student.username || "",
          section: student.section || (typeof student.class === "string" ? student.class.split(" ")[1] || "" : ""),
          dept: student.dept || "",
          assessmentCompleted: student.assessment_completed || false,
          assessmentStatus: student.assessment_completed ? "Completed" : "Pending",
          malpractice: student.malpractice || { attempted: false, diversions: 0 },
          aptitudeMarks: typeof student.aptitudeMarks === "number" ? student.aptitudeMarks : null,
          codingMarks: typeof student.codingMarks === "number" ? student.codingMarks : null,
          mockMarks: typeof student.mockMarks === "number" ? student.mockMarks : null,
          attendancePercentage: student.attendance_percentage,
          placed: student.placed,
        }));

        const uniqueStudents = Array.from(new Map(combinedStudents.map((student) => [student.id, student])).values());
        setStudentsData(uniqueStudents.filter((student) => student.assessmentCompleted));
      } catch (error) {
        console.error(error);
        setFetchError("Unable to load student list from the database.");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudentData();
  }, []);

  useEffect(() => {
    if (monitoringActive) {
      const handleVisibility = () => {
        if (document.hidden) {
          setMonitorLogs((prev) => [...prev, "Tab switched away during monitoring"]);
          setViolationCount((prev) => Math.min(prev + 1, 5));
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);
      return () => document.removeEventListener("visibilitychange", handleVisibility);
    }
  }, [monitoringActive]);

  useEffect(() => {
    localStorage.setItem("placement_aptitude_questions", JSON.stringify(aptitudeQuestions));
  }, [aptitudeQuestions]);
  useEffect(() => {
    localStorage.setItem("placement_coding_questions", JSON.stringify(codingQuestions));
  }, [codingQuestions]);
  useEffect(() => {
    localStorage.setItem("placement_mock_questions", JSON.stringify(mockQuestions));
  }, [mockQuestions]);
  useEffect(() => {
    localStorage.setItem("placement_results_published", resultsPublished ? "true" : "false");
  }, [resultsPublished]);
  useEffect(() => {
    if (assessmentStartAt) localStorage.setItem("placement_assessment_start_at", String(assessmentStartAt));
  }, [assessmentStartAt]);

  const activeAssessmentRemaining = useMemo(() => {
    if (!assessmentStartAt) return null;
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - assessmentStartAt);
    if (diff <= 0) return 0;
    return Math.floor(diff / 1000);
  }, [assessmentStartAt]);

  const topStudents = useMemo(() => {
    return [...studentsData].sort((a, b) => getTotal(b) - getTotal(a));
  }, [studentsData]);

  const deptStats = useMemo(() => {
    return departments.map((dept) => {
      const students = studentsData.filter((student) => student.dept === dept);
      const average = students.length ? Math.round(students.reduce((sum, item) => sum + getTotal(item), 0) / students.length) : 0;
      return { dept, count: students.length, average };
    });
  }, [studentsData]);

  const openQuestionCreator = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType("");
  };

  const addAptitudeQuestion = () => {
    setAptitudeQuestions((prev) => [...prev, { id: Date.now(), text: "New question", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0, explanation: "" }]);
  };
  const updateAptitudeQuestion = (index, field, value) => {
    setAptitudeQuestions((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };
  const updateAptitudeOption = (index, optionIndex, value) => {
    setAptitudeQuestions((prev) => prev.map((item, idx) => idx === index ? { ...item, options: item.options.map((option, oidx) => oidx === optionIndex ? value : option) } : item));
  };
  const removeAptitudeQuestion = (index) => setAptitudeQuestions((prev) => prev.filter((_, idx) => idx !== index));

  const addCodingQuestion = () => {
    setCodingQuestions((prev) => [...prev, { id: Date.now(), text: "New coding problem", testCases: "", expectedOutput: "" }]);
  };
  const updateCodingQuestion = (index, field, value) => {
    setCodingQuestions((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };
  const removeCodingQuestion = (index) => setCodingQuestions((prev) => prev.filter((_, idx) => idx !== index));

  const addMockQuestion = () => {
    setMockQuestions((prev) => [...prev, { id: Date.now(), text: "New mock interview question", answer: "", explanation: "" }]);
  };
  const updateMockQuestion = (index, field, value) => {
    setMockQuestions((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };
  const removeMockQuestion = (index) => setMockQuestions((prev) => prev.filter((_, idx) => idx !== index));

  const publishResults = () => {
    setResultsPublished(true);
    alert("Assessment results published successfully.");
  };

  const showDepartmentDetails = (dept) => {
    navigate(`/placement/assessments/${encodeURIComponent(dept)}`);
  };

  const backToMainView = () => {
    navigate(`/placement/assessments`);
  };

  const sendMeetMessage = (student) => {
    const msg = `Dear ${student.name},\n\nIt has been identified that you were involved in malpractice during the assessment. You are requested to meet the Placement Officer immediately for further discussion regarding this matter.`;
    alert(msg);
  };

  const sendImprovementMessage = (student) => {
    const category = getNeedImprovementReason(student);
    const msg = `Dear ${student.name},\n\nYour performance in the recent assessment indicates that improvement is needed. You are advised to concentrate more on the following topics: ${category}.\n\nKindly spend additional time practicing and strengthening your understanding in these areas to improve your future performance.`;
    alert(msg);
  };

  const requestMonitoringAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMonitoringAllowed(true);
      setMonitorLogs((prev) => [...prev, "Camera and microphone access granted."]);
    } catch (error) {
      setMonitorLogs((prev) => [...prev, "Camera/microphone access denied."]);
      alert("Please allow camera and microphone access to enable monitoring.");
    }
  };

  const startMonitoring = () => {
    if (!monitoringAllowed) {
      alert("Please grant camera and microphone access first.");
      return;
    }
    setMonitoringActive(true);
    setMonitorLogs((prev) => [...prev, "Monitoring agent started."]);
    if (!assessmentStartAt) setAssessmentStartAt(Date.now());
  };

  const stopMonitoring = () => {
    setMonitoringActive(false);
    setMonitorLogs((prev) => [...prev, "Monitoring stopped."]);
  };

  const simulateViolation = (reason) => {
    setViolationCount((prev) => Math.min(prev + 1, 5));
    setMonitorLogs((prev) => [...prev, `Detected violation: ${reason}`]);
  };

  const departmentStudents = useMemo(() => {
    if (!selectedDeptFromUrl) return [];
    return [...studentsData]
      .filter((student) => student.dept === selectedDeptFromUrl && student.assessmentCompleted)
      .sort((a, b) => getTotal(b) - getTotal(a));
  }, [studentsData, selectedDeptFromUrl]);

  const isAssessmentActive = assessmentStartAt ? activeAssessmentRemaining > 0 : false;

  const isDepartmentView = Boolean(selectedDeptFromUrl);

  const departmentTitle = selectedDeptFromUrl ? `${selectedDeptFromUrl} Department` : "";

  return (
    <div style={{ padding: "28px", maxWidth: "1400px", margin: "auto", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#f0f4f9" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0a2b3e" }}>📋 Placement Officer Dashboard</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginTop: "12px" }}>
          <div style={{ color: "#475569" }}>Assessment Management • Create assessments and review department results</div>
          <button
            style={{ padding: "10px 18px", borderRadius: "30px", border: "none", backgroundColor: "#64748b", color: "white", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/placement/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {fetchError && (
        <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "18px", backgroundColor: "#fee2e2", color: "#b91c1c" }}>
          {fetchError}
        </div>
      )}
      {isLoadingStudents && (
        <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "18px", backgroundColor: "#f8fafc", color: "#0f172a" }}>
          Loading student records from the database...
        </div>
      )}

      {!isDepartmentView ? (
        <>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "18px", color: "#1f4f2d", borderLeft: "4px solid #2b7e3a", paddingLeft: "14px" }}>📝 Create Assessments</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
            {[
              { key: "aptitude", title: "Aptitude Assessment", emoji: "🧠", subtitle: "Create Questions | Set Options | Define Answers" },
              { key: "coding", title: "Coding Assessment", emoji: "💻", subtitle: "Create Problems | Test Cases | Expected Output" },
              { key: "mock", title: "Mock Interview", emoji: "🎤", subtitle: "Create Questions | Guidelines | Detailed Answers" },
            ].map((tile) => (
              <div
                key={tile.key}
                onClick={() => openQuestionCreator(tile.key)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "28px",
                  padding: "28px",
                  cursor: "pointer",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: "3rem" }}>{tile.emoji}</div>
                <div>
                  <h4 style={{ fontSize: "1.45rem", margin: "16px 0 8px 0" }}>{tile.title}</h4>
                  <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>{tile.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px", marginBottom: "36px" }}>
            <div style={{ background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: "10px" }}>Total Students</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f3b2c" }}>{studentsData.length}</div>
            </div>
            <div style={{ background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: "10px" }}>Completed Assessments</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#047857" }}>{studentsData.filter((s) => s.assessmentCompleted).length}</div>
            </div>
            <div style={{ background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: "10px" }}>Malpractice Cases</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#b45309" }}>{studentsData.filter((s) => s.malpractice?.attempted).length}</div>
            </div>
            <div style={{ background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: "10px" }}>Top Score</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a" }}>{topStudents.length ? getTotal(topStudents[0]) : 0}</div>
            </div>
          </div>

          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "18px", color: "#1f4f2d", borderLeft: "4px solid #2b7e3a", paddingLeft: "14px" }}>📊 Department-wise Assessment Results</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
            {deptStats.map((dept) => (
              <div
                key={dept.dept}
                onClick={() => showDepartmentDetails(dept.dept)}
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                  color: "white",
                  borderRadius: "28px",
                  padding: "28px",
                  cursor: "pointer",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  minHeight: "180px",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "18px" }}>🏛️</div>
                <h4 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{dept.dept} Department</h4>
                <p style={{ opacity: 0.9, marginBottom: "6px" }}>Students: {dept.count}</p>
                <p style={{ opacity: 0.9 }}>Avg: {dept.average}</p>
              </div>
            ))}
          </div>

          <div style={{ overflowX: "auto", background: "white", borderRadius: "28px", padding: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 18px 0", fontSize: "1.2rem", fontWeight: 600, color: "#1f4f2d" }}>🏅 Student Results by Marks</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>#</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Name</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Register No</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Section</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Status</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Malpractice</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Aptitude</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Coding</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Mock</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Total</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student, index) => (
                  <tr key={student.id} style={{ background: index % 2 === 0 ? "white" : "#fbfcfd" }}>
                    <td style={{ padding: "14px" }}>{index + 1}</td>
                    <td style={{ padding: "14px" }}>{student.name}</td>
                    <td style={{ padding: "14px" }}>{student.registerNo}</td>
                    <td style={{ padding: "14px" }}>{student.section}</td>
                    <td style={{ padding: "14px" }}>{student.assessmentStatus}</td>
                    <td style={{ padding: "14px" }}>{student.malpractice.attempted ? `Attempted (${student.malpractice.diversions}/5)` : "Not attempted"}</td>
                    <td style={{ padding: "14px" }}>{student.aptitudeMarks != null ? `${student.aptitudeMarks}%` : "—"}</td>
                    <td style={{ padding: "14px" }}>{student.codingMarks != null ? `${student.codingMarks}%` : "—"}</td>
                    <td style={{ padding: "14px" }}>{student.mockMarks != null ? `${student.mockMarks}%` : "—"}</td>
                    <td style={{ padding: "14px" }}>{student.aptitudeMarks != null && student.codingMarks != null && student.mockMarks != null ? `${getTotal(student)}%` : "—"}</td>
                    <td style={{ padding: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button className="action-btn meet-btn" style={{ background: "#ef4444", color: "white", padding: "8px 14px", borderRadius: "30px", border: "none", cursor: "pointer" }} onClick={() => sendMeetMessage(student)}>Meet Me</button>
                      {getNeedImprovementReason(student) && (
                        <button className="action-btn improve-btn" style={{ background: "#f59e0b", color: "white", padding: "8px 14px", borderRadius: "30px", border: "none", cursor: "pointer" }} onClick={() => sendImprovementMessage(student)}>Need Improvement</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modalType && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
              <div style={{ width: "min(95%, 840px)", maxHeight: "85vh", overflowY: "auto", borderRadius: "32px", background: "white", padding: "28px", position: "relative" }}>
                <button onClick={closeModal} style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
                <h3 style={{ marginTop: 0, fontSize: "1.5rem", color: "#0f172a" }}>
                  {modalType === "aptitude" ? "🧠 Aptitude Question Builder" : modalType === "coding" ? "💻 Coding Problem Builder" : "🎤 Mock Interview Question Builder"}
                </h3>
                {(modalType === "aptitude" ? aptitudeQuestions : modalType === "coding" ? codingQuestions : mockQuestions).
                  map((item, index) => (
                    <div key={item.id} style={{ background: "#f8fafc", borderRadius: "20px", padding: "18px", marginBottom: "18px", border: "1px solid #e2e8f0" }}>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Question {index + 1}</label>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(event) => {
                            if (modalType === "aptitude") updateAptitudeQuestion(index, "text", event.target.value);
                            if (modalType === "coding") updateCodingQuestion(index, "text", event.target.value);
                            if (modalType === "mock") updateMockQuestion(index, "text", event.target.value);
                          }}
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                        />
                      </div>
                      {modalType === "aptitude" && (
                        <>
                          {item.options.map((option, optIndex) => (
                            <div key={optIndex} style={{ marginBottom: "14px" }}>
                              <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Option {String.fromCharCode(65 + optIndex)}</label>
                              <input
                                type="text"
                                value={option}
                                onChange={(event) => updateAptitudeOption(index, optIndex, event.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                              />
                            </div>
                          ))}
                          <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "1fr 1fr", marginBottom: "14px" }}>
                            <div>
                              <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Correct Option Index</label>
                              <input
                                type="number"
                                min="0"
                                max="3"
                                value={item.correct}
                                onChange={(event) => updateAptitudeQuestion(index, "correct", parseInt(event.target.value, 10))}
                                style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                              />
                            </div>
                            <div>
                              <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Explanation</label>
                              <textarea
                                rows="3"
                                value={item.explanation}
                                onChange={(event) => updateAptitudeQuestion(index, "explanation", event.target.value)}
                                style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {modalType === "coding" && (
                        <>
                          <div style={{ marginBottom: "14px" }}>
                            <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Test Cases</label>
                            <textarea
                              rows="3"
                              value={item.testCases}
                              onChange={(event) => updateCodingQuestion(index, "testCases", event.target.value)}
                              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                            />
                          </div>
                          <div style={{ marginBottom: "14px" }}>
                            <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Expected Output</label>
                            <input
                              type="text"
                              value={item.expectedOutput}
                              onChange={(event) => updateCodingQuestion(index, "expectedOutput", event.target.value)}
                              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                            />
                          </div>
                        </>
                      )}
                      {modalType === "mock" && (
                        <>
                          <div style={{ marginBottom: "14px" }}>
                            <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Answer</label>
                            <textarea
                              rows="3"
                              value={item.answer}
                              onChange={(event) => updateMockQuestion(index, "answer", event.target.value)}
                              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                            />
                          </div>
                          <div style={{ marginBottom: "14px" }}>
                            <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Detailed Explanation</label>
                            <textarea
                              rows="3"
                              value={item.explanation}
                              onChange={(event) => updateMockQuestion(index, "explanation", event.target.value)}
                              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                            />
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (modalType === "aptitude") removeAptitudeQuestion(index);
                          if (modalType === "coding") removeCodingQuestion(index);
                          if (modalType === "mock") removeMockQuestion(index);
                        }}
                        style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "18px", padding: "10px 16px", cursor: "pointer" }}
                      >
                        Remove Question
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => {
                    if (modalType === "aptitude") addAptitudeQuestion();
                    if (modalType === "coding") addCodingQuestion();
                    if (modalType === "mock") addMockQuestion();
                  }}
                  style={{ background: "#2563eb", color: "white", padding: "14px 22px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  Add {modalType === "aptitude" ? "Aptitude" : modalType === "coding" ? "Coding" : "Mock Interview"} Question
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "1.75rem", margin: 0, color: "#0f172a" }}>{selectedDeptFromUrl} Department Results</h3>
              <p style={{ margin: "8px 0 0", color: "#475569" }}>Student list sorted by total marks. Highest scoring students appear first.</p>
            </div>
            <button
              type="button"
              onClick={backToMainView}
              style={{ background: "#2563eb", color: "white", padding: "12px 22px", borderRadius: "30px", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Back to Assessments
            </button>
          </div>
        </div>
      )}

      {isDepartmentView && (
        <div style={{ background: "white", borderRadius: "28px", padding: "26px", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid #e2e8f0", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>{departmentTitle}</h3>
              <p style={{ margin: "8px 0 0", color: "#475569" }}>Showing completed assessment students sorted by highest total marks.</p>
            </div>
            <button
              type="button"
              onClick={backToMainView}
              style={{ background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "30px", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Back to Assessments
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>#</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Name</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Register No</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Section</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Status</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Malpractice</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Aptitude</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Coding</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Mock</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Total</th>
                  <th style={{ padding: "14px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {departmentStudents.map((student, index) => {
                  const improvementTopics = getNeedImprovementReason(student);
                  return (
                    <tr key={student.id} style={{ background: index % 2 === 0 ? "white" : "#fbfcfd" }}>
                      <td style={{ padding: "14px" }}>{index + 1}</td>
                      <td style={{ padding: "14px" }}>{student.name}</td>
                      <td style={{ padding: "14px" }}>{student.registerNo}</td>
                      <td style={{ padding: "14px" }}>{student.section}</td>
                      <td style={{ padding: "14px" }}>{student.assessmentStatus}</td>
                      <td style={{ padding: "14px" }}>{student.malpractice.attempted ? `Attempted (${student.malpractice.diversions}/5)` : "Not attempted"}</td>
                      <td style={{ padding: "14px" }}>{student.aptitudeMarks != null ? `${student.aptitudeMarks}%` : "—"}</td>
                      <td style={{ padding: "14px" }}>{student.codingMarks != null ? `${student.codingMarks}%` : "—"}</td>
                      <td style={{ padding: "14px" }}>{student.mockMarks != null ? `${student.mockMarks}%` : "—"}</td>
                      <td style={{ padding: "14px" }}>{student.aptitudeMarks != null && student.codingMarks != null && student.mockMarks != null ? `${getTotal(student)}%` : "—"}</td>
                      <td style={{ padding: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          className="action-btn meet-btn"
                          style={{ background: "#ef4444", color: "white", padding: "8px 14px", borderRadius: "30px", border: "none", cursor: "pointer" }}
                          onClick={() => sendMeetMessage(student)}
                        >
                          Meet Me
                        </button>
                        {improvementTopics && (
                          <button
                            className="action-btn improve-btn"
                            style={{ background: "#f59e0b", color: "white", padding: "8px 14px", borderRadius: "30px", border: "none", cursor: "pointer" }}
                            onClick={() => sendImprovementMessage(student)}
                          >
                            Need Improvement
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {departmentStudents.length === 0 && (
              <div style={{ marginTop: "18px", color: "#475569" }}>No completed assessment records found for this department.</div>
            )}
          </div>
        </div>
      )}

      {modalType && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ width: "min(95%, 840px)", maxHeight: "85vh", overflowY: "auto", borderRadius: "32px", background: "white", padding: "28px", position: "relative" }}>
            <button onClick={closeModal} style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            <h3 style={{ marginTop: 0, fontSize: "1.5rem", color: "#0f172a" }}>
              {modalType === "aptitude" ? "🧠 Aptitude Question Builder" : modalType === "coding" ? "💻 Coding Problem Builder" : "🎤 Mock Interview Question Builder"}
            </h3>
            {(modalType === "aptitude" ? aptitudeQuestions : modalType === "coding" ? codingQuestions : mockQuestions).
              map((item, index) => (
                <div key={item.id} style={{ background: "#f8fafc", borderRadius: "20px", padding: "18px", marginBottom: "18px", border: "1px solid #e2e8f0" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Question {index + 1}</label>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(event) => {
                        if (modalType === "aptitude") updateAptitudeQuestion(index, "text", event.target.value);
                        if (modalType === "coding") updateCodingQuestion(index, "text", event.target.value);
                        if (modalType === "mock") updateMockQuestion(index, "text", event.target.value);
                      }}
                      style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                    />
                  </div>
                  {modalType === "aptitude" && (
                    <>
                      {item.options.map((option, optIndex) => (
                        <div key={optIndex} style={{ marginBottom: "14px" }}>
                          <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Option {String.fromCharCode(65 + optIndex)}</label>
                          <input
                            type="text"
                            value={option}
                            onChange={(event) => updateAptitudeOption(index, optIndex, event.target.value)}
                            style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                          />
                        </div>
                      ))}
                      <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "1fr 1fr", marginBottom: "14px" }}>
                        <div>
                          <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Correct Option Index</label>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            value={item.correct}
                            onChange={(event) => updateAptitudeQuestion(index, "correct", parseInt(event.target.value, 10))}
                            style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Explanation</label>
                          <textarea
                            rows="3"
                            value={item.explanation}
                            onChange={(event) => updateAptitudeQuestion(index, "explanation", event.target.value)}
                            style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {modalType === "coding" && (
                    <>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Test Cases</label>
                        <textarea
                          rows="3"
                          value={item.testCases}
                          onChange={(event) => updateCodingQuestion(index, "testCases", event.target.value)}
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                        />
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Expected Output</label>
                        <input
                          type="text"
                          value={item.expectedOutput}
                          onChange={(event) => updateCodingQuestion(index, "expectedOutput", event.target.value)}
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                        />
                      </div>
                    </>
                  )}
                  {modalType === "mock" && (
                    <>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Answer</label>
                        <textarea
                          rows="3"
                          value={item.answer}
                          onChange={(event) => updateMockQuestion(index, "answer", event.target.value)}
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                        />
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>Detailed Explanation</label>
                        <textarea
                          rows="3"
                          value={item.explanation}
                          onChange={(event) => updateMockQuestion(index, "explanation", event.target.value)}
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #e2e8f0", marginTop: "8px" }}
                        />
                      </div>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (modalType === "aptitude") removeAptitudeQuestion(index);
                      if (modalType === "coding") removeCodingQuestion(index);
                      if (modalType === "mock") removeMockQuestion(index);
                    }}
                    style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "18px", padding: "10px 16px", cursor: "pointer" }}
                  >
                    Remove Question
                  </button>
                </div>
              ))}
            <button
              type="button"
              onClick={() => {
                if (modalType === "aptitude") addAptitudeQuestion();
                if (modalType === "coding") addCodingQuestion();
                if (modalType === "mock") addMockQuestion();
              }}
              style={{ background: "#2563eb", color: "white", padding: "14px 22px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Add {modalType === "aptitude" ? "Aptitude" : modalType === "coding" ? "Coding" : "Mock Interview"} Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
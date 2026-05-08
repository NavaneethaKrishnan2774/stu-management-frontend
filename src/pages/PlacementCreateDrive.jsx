import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const departmentOptions = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];
const locationOptions = ["On-campus", "Off-campus", "Virtual"];
const batchOptions = ["2024", "2025", "2026"];
const arrearsOptions = ["Not Allowed", "Allowed (up to 2)", "Conditional"];
const notificationOptions = ["Email & SMS", "Email Only", "SMS Only", "None"];
const perkOptions = ["Food", "Transport", "Medical Insurance", "Work From Home", "Gym Membership", "Performance Bonus"];
const questionTypes = ["Text Answer", "Yes/No", "Multiple Choice"];
const roundModes = ["Online", "Offline"];

const mockStudents = [
  { id: 1, rollNo: "ENG2024001", name: "Aarav Mehta", branch: "CSE", cgpa: 9.2, tenthPercent: 95, twelfthPercent: 94, arrearsCount: 0, email: "aarav@university.edu" },
  { id: 2, rollNo: "ENG2024002", name: "Ishita Verma", branch: "CSE", cgpa: 9.0, tenthPercent: 92, twelfthPercent: 93, arrearsCount: 0, email: "ishita@university.edu" },
  { id: 3, rollNo: "ENG2024003", name: "Rohan Sharma", branch: "ECE", cgpa: 8.8, tenthPercent: 89, twelfthPercent: 88, arrearsCount: 0, email: "rohan@university.edu" },
  { id: 4, rollNo: "ENG2024004", name: "Priya Singh", branch: "MECH", cgpa: 8.5, tenthPercent: 87, twelfthPercent: 85, arrearsCount: 1, email: "priya@university.edu" },
  { id: 5, rollNo: "ENG2024005", name: "Kunal Patel", branch: "EEE", cgpa: 8.1, tenthPercent: 84, twelfthPercent: 82, arrearsCount: 2, email: "kunal@university.edu" },
  { id: 6, rollNo: "ENG2024006", name: "Sanya Kapoor", branch: "CIVIL", cgpa: 8.4, tenthPercent: 88, twelfthPercent: 86, arrearsCount: 0, email: "sanya@university.edu" },
  { id: 7, rollNo: "ENG2024007", name: "Nikhil Desai", branch: "IT", cgpa: 8.9, tenthPercent: 91, twelfthPercent: 90, arrearsCount: 0, email: "nikhil@university.edu" },
  { id: 8, rollNo: "ENG2024008", name: "Meera Reddy", branch: "AIDS", cgpa: 8.2, tenthPercent: 85, twelfthPercent: 83, arrearsCount: 1, email: "meera@university.edu" },
  { id: 9, rollNo: "ENG2024009", name: "Aditya Nair", branch: "CSE", cgpa: 7.9, tenthPercent: 80, twelfthPercent: 79, arrearsCount: 2, email: "aditya@university.edu" },
  { id: 10, rollNo: "ENG2024010", name: "Neha Gupta", branch: "ECE", cgpa: 8.3, tenthPercent: 86, twelfthPercent: 84, arrearsCount: 0, email: "neha@university.edu" },
  { id: 11, rollNo: "ENG2024011", name: "Tarun Jain", branch: "MECH", cgpa: 7.8, tenthPercent: 76, twelfthPercent: 78, arrearsCount: 0, email: "tarun@university.edu" },
  { id: 12, rollNo: "ENG2024012", name: "Aisha Khan", branch: "CIVIL", cgpa: 8.6, tenthPercent: 90, twelfthPercent: 88, arrearsCount: 0, email: "aisha@university.edu" },
  { id: 13, rollNo: "ENG2024013", name: "Vikram Joshi", branch: "EEE", cgpa: 8.0, tenthPercent: 81, twelfthPercent: 80, arrearsCount: 1, email: "vikram@university.edu" },
  { id: 14, rollNo: "ENG2024014", name: "Rhea Malhotra", branch: "CSE", cgpa: 9.1, tenthPercent: 93, twelfthPercent: 91, arrearsCount: 0, email: "rhea@university.edu" },
  { id: 15, rollNo: "ENG2024015", name: "Dev Shah", branch: "IT", cgpa: 7.7, tenthPercent: 75, twelfthPercent: 77, arrearsCount: 1, email: "dev@university.edu" },
  { id: 16, rollNo: "ENG2024016", name: "Priyanka Nair", branch: "CSE", cgpa: 8.7, tenthPercent: 90, twelfthPercent: 89, arrearsCount: 0, email: "priyanka@university.edu" },
  { id: 17, rollNo: "ENG2024017", name: "Rahul Mehta", branch: "ECE", cgpa: 8.2, tenthPercent: 84, twelfthPercent: 85, arrearsCount: 0, email: "rahul@university.edu" },
  { id: 18, rollNo: "ENG2024018", name: "Simran Kaur", branch: "MECH", cgpa: 8.5, tenthPercent: 87, twelfthPercent: 88, arrearsCount: 0, email: "simran@university.edu" },
  { id: 19, rollNo: "ENG2024019", name: "Ankit Verma", branch: "EEE", cgpa: 7.5, tenthPercent: 74, twelfthPercent: 76, arrearsCount: 2, email: "ankit@university.edu" },
  { id: 20, rollNo: "ENG2024020", name: "Shreya Bose", branch: "CIVIL", cgpa: 8.3, tenthPercent: 88, twelfthPercent: 86, arrearsCount: 0, email: "shreya@university.edu" },
];

const initialDriveState = {
  id: null,
  company: "",
  companyHistory: "",
  companyLocation: "",
  companyDocument: null,
  expectedSkills: [],
  jobRole: "",
  package: "",
  vacancies: "",
  location: locationOptions[0],
  driveDate: "",
  lastDate: "",
  batches: [],
  departments: [],
  contact: {
    name: "",
    designation: "",
    email: "",
    phone: "",
  },
  bond: {
    period: "No Bond",
    amount: "",
  },
  eligibility: {
    cgpa: "",
    tenth: "",
    twelfth: "",
    arrears: arrearsOptions[0],
    shortlistLimit: "",
  },
  perks: [],
  questions: [
    { id: 1, text: "", type: questionTypes[0] },
  ],
  notifications: notificationOptions[0],
  rounds: [
    { id: 1, title: "Aptitude Test", mode: roundModes[0], date: "", time: "", desc: "" },
    { id: 2, title: "Technical Interview", mode: roundModes[0], date: "", time: "", desc: "" },
  ],
  jdFile: null,
};

const styles = {
  page: {
    padding: "24px 20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4f9 0%, #e8eef5 100%)",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    padding: "32px 40px",
  },
  headingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    margin: 0,
    color: "#0a2b3e",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  subtitle: {
    marginTop: "0.25rem",
    marginBottom: "20px",
    color: "#4a6a85",
    lineHeight: 1.5,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "40px",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: "12px",
  },
  stepIndicator: {
    display: "flex",
    gap: "15px",
    margin: "25px 0 30px 0",
    padding: "10px 0",
    borderBottom: "2px solid #e2e8f0",
  },
  step: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    borderRadius: "40px",
    background: "#f1f5f9",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "0.85rem",
    transition: "all 0.3s",
  },
  stepActive: {
    background: "#1f5e3a",
    color: "white",
    boxShadow: "0 2px 8px rgba(31, 94, 58, 0.3)",
  },
  stepCompleted: {
    background: "#2b7e3a",
    color: "white",
  },
  sectionTitle: {
    fontSize: "1.35rem",
    fontWeight: 600,
    margin: "1.8rem 0 1rem 0",
    color: "#1f4f2d",
    borderLeft: "4px solid #2b7e3a",
    paddingLeft: "14px",
  },
  formGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "8px",
  },
  formGroup: {
    flex: "1 1 280px",
    marginBottom: "18px",
  },
  fullWidth: {
    flex: "1 1 100%",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "8px",
    fontSize: "0.85rem",
    letterSpacing: "0.3px",
    color: "#1e2f41",
  },
  required: {
    color: "#dc2626",
    marginLeft: "4px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1.5px solid #e2edf2",
    background: "#fff",
    fontSize: "0.9rem",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1.5px solid #e2edf2",
    background: "#fff",
    fontSize: "0.9rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1.5px solid #e2edf2",
    background: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    resize: "vertical",
    minHeight: "110px",
  },
  rowDuo: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  deptButtonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "8px",
    marginBottom: "12px",
  },
  deptButton: {
    background: "#f8fafc",
    border: "2px solid #e0e8f0",
    borderRadius: "60px",
    padding: "7px 20px",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  deptButtonActive: {
    background: "#1f5e3a",
    borderColor: "#1f5e3a",
    color: "white",
  },
  selectedBadge: {
    background: "#eef2ff",
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    display: "inline-block",
  },
  perkGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginTop: "10px",
  },
  perkItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f8fafc",
    padding: "8px 16px",
    borderRadius: "40px",
    border: "1px solid #e2e8f0",
  },
  eligibilityCard: {
    background: "#fbfef9",
    borderRadius: "24px",
    padding: "18px 24px",
    margin: "12px 0 20px 0",
    border: "1px solid #e2f0e5",
  },
  questionItem: {
    background: "#f8fafc",
    padding: "12px 16px",
    borderRadius: "16px",
    marginBottom: "12px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  roundBox: {
    background: "#ffffff",
    padding: "18px 22px",
    marginBottom: "20px",
    borderRadius: "24px",
    border: "1px solid #e2edf2",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
  },
  roundHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  buttonPrimary: {
    fontWeight: 500,
    borderRadius: "40px",
    padding: "10px 22px",
    border: "none",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.95rem",
    background: "#0f3b2c",
    color: "white",
  },
  buttonSuccess: {
    fontWeight: 500,
    borderRadius: "40px",
    padding: "10px 22px",
    border: "none",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.95rem",
    background: "#2b7e3a",
    color: "white",
  },
  buttonDanger: {
    fontWeight: 500,
    borderRadius: "40px",
    padding: "10px 22px",
    border: "1px solid #ffcdcd",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.95rem",
    background: "#fff0f0",
    color: "#b91c1c",
  },
  buttonAdd: {
    fontWeight: 500,
    borderRadius: "40px",
    padding: "10px 22px",
    border: "1px dashed #4caf7a",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.95rem",
    background: "#e9f7ef",
    color: "#0f6e34",
  },
  buttonSecondary: {
    fontWeight: 500,
    borderRadius: "40px",
    padding: "10px 22px",
    border: "none",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.95rem",
    background: "#64748b",
    color: "white",
  },
  actionButtons: {
    display: "flex",
    gap: "16px",
    marginTop: "32px",
    flexWrap: "wrap",
  },
  toastMessage: {
    marginTop: "20px",
    fontSize: "0.85rem",
  },
  studentsSection: {
    marginTop: "30px",
    borderTop: "2px solid #e2e8f0",
    paddingTop: "20px",
  },
  studentsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    borderRadius: "16px",
    overflow: "hidden",
  },
  tableCell: {
    padding: "12px 10px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
  },
  tableHead: {
    background: "#f1f5f9",
    fontWeight: 600,
  },
  checkboxCol: {
    width: "40px",
    textAlign: "center",
  },
  eligibleCount: {
    background: "#e0f2fe",
    padding: "8px 16px",
    borderRadius: "40px",
    display: "inline-block",
    marginBottom: "15px",
    fontSize: "0.85rem",
  },
  reviewActions: {
    display: "flex",
    gap: "12px",
    margin: "20px 0",
    flexWrap: "wrap",
  },
  alert: {
    padding: "12px 20px",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  alertInfo: {
    background: "#e0f2fe",
    color: "#075985",
    borderLeft: "4px solid #0284c7",
  },
  alertSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    borderLeft: "4px solid #10b981",
  },
  alertWarning: {
    background: "#fed7aa",
    color: "#9a3412",
    borderLeft: "4px solid #ea580c",
  },
};

const pickStepStyle = (step, currentStep) => {
  const base = { ...styles.step };
  if (step === currentStep) return { ...base, ...styles.stepActive };
  if (step < currentStep) return { ...base, ...styles.stepCompleted };
  return base;
};

export default function PlacementCreateDrive() {
  const navigate = useNavigate();
  const [driveData, setDriveData] = useState(initialDriveState);
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [driveStatus, setDriveStatus] = useState("Draft");
  const [driveStage, setDriveStage] = useState("status-draft");
  const [sendMessage, setSendMessage] = useState("");

  const updateField = (field, value) => {
    setDriveData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (group, key, value) => {
    setDriveData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const toggleDepartment = (dept) => {
    setDriveData((prev) => {
      const departments = prev.departments.includes(dept)
        ? prev.departments.filter((item) => item !== dept)
        : [...prev.departments, dept];
      return { ...prev, departments };
    });
  };

  const togglePerk = (perk) => {
    setDriveData((prev) => {
      const perks = prev.perks.includes(perk)
        ? prev.perks.filter((item) => item !== perk)
        : [...prev.perks, perk];
      return { ...prev, perks };
    });
  };

  const handleBatchChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setDriveData((prev) => ({ ...prev, batches: selected }));
  };

  const handleJDFile = (event) => {
    setDriveData((prev) => ({ ...prev, jdFile: event.target.files[0] || null }));
  };

  const addQuestion = () => {
    setDriveData((prev) => ({
      ...prev,
      questions: [...prev.questions, { id: Date.now(), text: "", type: questionTypes[0] }],
    }));
  };

  const updateQuestion = (index, key, value) => {
    setDriveData((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [key]: value };
      return { ...prev, questions };
    });
  };

  const removeQuestion = (index) => {
    setDriveData((prev) => {
      const questions = prev.questions.filter((_, idx) => idx !== index);
      return { ...prev, questions: questions.length ? questions : [{ id: Date.now(), text: "", type: questionTypes[0] }] };
    });
  };

  const addRound = () => {
    setDriveData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, { id: Date.now(), title: "", mode: roundModes[0], date: "", time: "", desc: "" }],
    }));
  };

  const updateRound = (index, key, value) => {
    setDriveData((prev) => {
      const rounds = [...prev.rounds];
      rounds[index] = { ...rounds[index], [key]: value };
      return { ...prev, rounds };
    });
  };

  const removeRound = (index) => {
    setDriveData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((_, idx) => idx !== index),
    }));
  };

  const showToast = (message, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    window.setTimeout(() => setToastMessage(""), 4500);
  };

  const buildFormData = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item === undefined || item === null) return;
          if (typeof item === 'object') {
            formData.append(key, JSON.stringify(item));
          } else {
            formData.append(key, item);
          }
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  };

  const filterEligibleStudents = () => {
    return mockStudents.filter((student) => {
      if (driveData.departments.length > 0 && !driveData.departments.includes(student.branch)) {
        return false;
      }
      if (driveData.eligibility.cgpa && parseFloat(student.cgpa) < parseFloat(driveData.eligibility.cgpa)) {
        return false;
      }
      if (driveData.eligibility.tenth && student.tenthPercent < Number(driveData.eligibility.tenth)) {
        return false;
      }
      if (driveData.eligibility.twelfth && student.twelfthPercent < Number(driveData.eligibility.twelfth)) {
        return false;
      }
      if (driveData.eligibility.arrears === "Not Allowed" && student.arrearsCount > 0) {
        return false;
      }
      if (driveData.eligibility.arrears === "Allowed (up to 2)" && student.arrearsCount > 2) {
        return false;
      }
      return true;
    });
  };

  const handleCreateDrive = async () => {
    if (!driveData.company || !driveData.jobRole) {
      showToast("Company Name and Job Role are required.", true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required.", true);
        return;
      }

      // Prepare the data for the API call
      const apiData = {
        company_name: driveData.company,
        company_history: driveData.companyHistory,
        company_location: driveData.companyLocation,
        expected_skills: driveData.expectedSkills,
        job_role: driveData.jobRole,
        package: driveData.package,
        vacancies: parseInt(driveData.vacancies) || 0,
        location: driveData.location,
        drive_date: driveData.driveDate,
        last_date_to_apply: driveData.lastDate,
        eligible_batches: driveData.batches,
        eligible_departments: driveData.departments,
        contact_person_name: driveData.contact.name,
        contact_person_designation: driveData.contact.designation,
        contact_person_email: driveData.contact.email,
        contact_person_phone: driveData.contact.phone,
        bond_period: driveData.bond.period,
        bond_amount: driveData.bond.amount,
        min_cgpa: driveData.eligibility.cgpa ? parseFloat(driveData.eligibility.cgpa) : null,
        min_10th_percentage: driveData.eligibility.tenth ? parseFloat(driveData.eligibility.tenth) : null,
        min_12th_percentage: driveData.eligibility.twelfth ? parseFloat(driveData.eligibility.twelfth) : null,
        arrears_allowed: driveData.eligibility.arrears,
        shortlist_limit: driveData.eligibility.shortlistLimit ? parseInt(driveData.eligibility.shortlistLimit) : null,
        perks: driveData.perks,
        additional_questions: driveData.questions.filter(q => q.text.trim()),
        notification_preference: driveData.notifications,
        rounds: driveData.rounds.map(round => ({
          title: round.title,
          mode: round.mode,
          date: round.date,
          time: round.time,
          description: round.desc
        })),
        jd_file: driveData.jdFile,
        company_document: driveData.companyDocument
      };

      const payload = driveData.jdFile ? buildFormData(apiData) : apiData;
      const response = await API.post("api/students/placement/create-drive/", payload, token);
      
      if (response.eligible_students) {
        setEligibleStudents(response.eligible_students);
        setDriveData(prev => ({ ...prev, id: response.drive_id })); // Store the drive ID
        setCurrentStep(2);
        setDriveStatus("Under Review");
        setDriveStage("status-review");
        showToast(`Drive created! ${response.eligible_students.length} eligible students identified.`);
      } else {
        showToast("Drive created but no eligible students found.", true);
      }
    } catch (error) {
      console.error("Error creating drive:", error);
      showToast("Failed to create drive. Please try again.", true);
    }
  };

  const handleSendDrive = async () => {
    if (eligibleStudents.length === 0) {
      showToast("No eligible students to send drive to.", true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required.", true);
        return;
      }

      const response = await API.post("api/students/placement/send-drive-to-students/", {
        drive_id: driveData.id,
        student_ids: eligibleStudents.map(s => s.id)
      }, token);

      setDriveStatus("Sent to Students");
      setDriveStage("status-published");
      setCurrentStep(3);
      setSendMessage(`Drive details sent successfully to ${eligibleStudents.length} eligible students via ${driveData.notifications}.`);
      showToast("Drive dispatched successfully.");
    } catch (error) {
      console.error("Error sending drive:", error);
      showToast("Failed to send drive. Please try again.", true);
    }
  };

  const renderStatusBadge = () => {
    const base = { ...styles.badge };
    let variant = {};
    switch (driveStage) {
      case "status-review":
        variant = { background: "#dbeafe", color: "#1e40af" };
        break;
      case "status-published":
        variant = { background: "#d1fae5", color: "#065f46" };
        break;
      case "status-closed":
        variant = { background: "#fee2e2", color: "#991b1b" };
        break;
      default:
        variant = { background: "#fef3c7", color: "#92400e" };
    }
    return <span style={{ ...base, ...variant }}>{driveStatus}</span>;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headingRow}>
          <div>
            <h2 style={styles.title}>Create Placement Drive</h2>
            <p style={styles.subtitle}>Advanced recruitment management | Engineering placements</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {renderStatusBadge()}
            <button onClick={() => navigate("/placement/dashboard")} style={{ ...styles.buttonSecondary, padding: "10px 18px" }}>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div style={styles.stepIndicator}>
          <div style={pickStepStyle(1, currentStep)}>{currentStep === 1 ? "1️⃣ Create Drive" : currentStep > 1 ? "✅ Create Drive" : "1️⃣ Create Drive"}</div>
          <div style={pickStepStyle(2, currentStep)}>{currentStep === 2 ? "2️⃣ Review Eligible Students" : currentStep > 2 ? "✅ Review Eligible Students" : "2️⃣ Review Eligible Students"}</div>
          <div style={pickStepStyle(3, currentStep)}>{currentStep === 3 ? "3️⃣ Send to Students" : "3️⃣ Send to Students"}</div>
        </div>

        {currentStep <= 1 && (
          <>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>🏢 Company Name <span style={styles.required}>*</span></label>
                <input style={styles.input} value={driveData.company} onChange={(e) => updateField("company", e.target.value)} placeholder="e.g., Google, Amazon, TCS" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>💼 Job Role <span style={styles.required}>*</span></label>
                <input style={styles.input} value={driveData.jobRole} onChange={(e) => updateField("jobRole", e.target.value)} placeholder="e.g., Full Stack Developer" />
              </div>
            </div>

            <h3 style={styles.sectionTitle}>📚 Company Information</h3>
            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>📖 Company History & Overview</label>
              <textarea style={{ ...styles.input, minHeight: "120px", fontFamily: "monospace", fontSize: "14px" }} value={driveData.companyHistory} onChange={(e) => updateField("companyHistory", e.target.value)} placeholder="Tell us about your company - founding year, mission, achievements, culture, etc." />
            </div>

            <div style={styles.rowDuo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>🌍 Company Location / Office Address</label>
                <input style={styles.input} value={driveData.companyLocation} onChange={(e) => updateField("companyLocation", e.target.value)} placeholder="e.g., Bangalore, India" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>📄 Company Profile / Brochure (PDF)</label>
                <input style={styles.input} type="file" accept=".pdf" onChange={(e) => {
                  const file = e.target.files?.[0];
                  updateField("companyDocument", file || null);
                }} />
                {driveData.companyDocument && <span style={{ fontSize: "12px", color: "#065f46" }}>✅ {driveData.companyDocument.name}</span>}
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>💡 Expected Skills & Qualifications</label>
              <div style={{ marginBottom: "12px" }}>
                <input style={styles.input} type="text" placeholder="Add a skill (e.g., Python, React, AWS) and press Add" onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !driveData.expectedSkills.includes(value)) {
                      setDriveData(prev => ({
                        ...prev,
                        expectedSkills: [...prev.expectedSkills, value]
                      }));
                      e.target.value = "";
                    }
                  }
                }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {driveData.expectedSkills.map((skill, idx) => (
                  <div key={idx} style={{
                    padding: "6px 12px",
                    background: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {skill}
                    <button type="button" onClick={() => setDriveData(prev => ({
                      ...prev,
                      expectedSkills: prev.expectedSkills.filter((_, i) => i !== idx)
                    }))} style={{
                      background: "none",
                      border: "none",
                      color: "#1e40af",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "0"
                    }}>✕</button>
                  </div>
                ))}
              </div>
              {driveData.expectedSkills.length === 0 && <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>No skills added yet</p>}
            </div>

            <div style={styles.rowDuo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>💰 Package (CTC in LPA)</label>
                <input style={styles.input} type="number" step="0.5" value={driveData.package} onChange={(e) => updateField("package", e.target.value)} placeholder="e.g., 15" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>📊 Number of Vacancies</label>
                <input style={styles.input} type="number" value={driveData.vacancies} onChange={(e) => updateField("vacancies", e.target.value)} placeholder="e.g., 25" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>📍 Drive Location</label>
                <select style={styles.select} value={driveData.location} onChange={(e) => updateField("location", e.target.value)}>
                  {locationOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.rowDuo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>📅 Drive Date</label>
                <input style={styles.input} type="date" value={driveData.driveDate} onChange={(e) => updateField("driveDate", e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>⏰ Last Date to Apply</label>
                <input style={styles.input} type="date" value={driveData.lastDate} onChange={(e) => updateField("lastDate", e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>🎓 Eligible Batches</label>
                <select style={styles.select} multiple value={driveData.batches} onChange={handleBatchChange} size={3}>
                  {batchOptions.map((batch) => (
                    <option key={batch} value={batch}>{batch} Passing Out</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>🎯 Eligible Departments (Click to select)</label>
              <div style={styles.deptButtonGroup}>
                {departmentOptions.map((dept) => {
                  const active = driveData.departments.includes(dept);
                  return (
                    <button type="button" key={dept} onClick={() => toggleDepartment(dept)} style={{ ...styles.deptButton, ...(active ? styles.deptButtonActive : {}) }}>
                      {dept}
                    </button>
                  );
                })}
              </div>
              <div><span style={styles.selectedBadge}>{driveData.departments.length ? driveData.departments.join(", ") : "None selected"}</span></div>
            </div>

            <h3 style={styles.sectionTitle}>👤 HR / Contact Person</h3>
            <div style={styles.rowDuo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Name</label>
                <input style={styles.input} value={driveData.contact.name} onChange={(e) => updateNested("contact", "name", e.target.value)} placeholder="e.g., Priya Sharma" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Designation</label>
                <input style={styles.input} value={driveData.contact.designation} onChange={(e) => updateNested("contact", "designation", e.target.value)} placeholder="HR Manager" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type="email" value={driveData.contact.email} onChange={(e) => updateNested("contact", "email", e.target.value)} placeholder="hr@company.com" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input style={styles.input} type="tel" value={driveData.contact.phone} onChange={(e) => updateNested("contact", "phone", e.target.value)} placeholder="+91 9876543210" />
              </div>
            </div>

            <div style={styles.rowDuo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>🏷️ Service Bond / Agreement</label>
                <select style={styles.select} value={driveData.bond.period} onChange={(e) => updateNested("bond", "period", e.target.value)}>
                  <option value="No Bond">No Bond</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>💰 Bond Amount (if any)</label>
                <input style={styles.input} value={driveData.bond.amount} onChange={(e) => updateNested("bond", "amount", e.target.value)} placeholder="e.g., ₹1,00,000" />
              </div>
            </div>

            <h3 style={styles.sectionTitle}>📋 Eligibility Criteria</h3>
            <div style={styles.eligibilityCard}>
              <div style={styles.rowDuo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Min CGPA</label>
                  <input style={styles.input} type="number" step="0.1" value={driveData.eligibility.cgpa} onChange={(e) => updateNested("eligibility", "cgpa", e.target.value)} placeholder="7.0" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>10th %</label>
                  <input style={styles.input} type="number" value={driveData.eligibility.tenth} onChange={(e) => updateNested("eligibility", "tenth", e.target.value)} placeholder="60" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>12th %</label>
                  <input style={styles.input} type="number" value={driveData.eligibility.twelfth} onChange={(e) => updateNested("eligibility", "twelfth", e.target.value)} placeholder="60" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Arrears Policy</label>
                <select style={styles.select} value={driveData.eligibility.arrears} onChange={(e) => updateNested("eligibility", "arrears", e.target.value)}>
                  {arrearsOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>🎯 Shortlist Limit (per round)</label>
                <input style={styles.input} type="number" value={driveData.eligibility.shortlistLimit} onChange={(e) => updateNested("eligibility", "shortlistLimit", e.target.value)} placeholder="e.g., 100" />
              </div>
            </div>

            <h3 style={styles.sectionTitle}>🎁 Additional Perks & Benefits</h3>
            <div style={styles.perkGrid}>
              {perkOptions.map((perk) => (
                <label key={perk} style={styles.perkItem}>
                  <input type="checkbox" checked={driveData.perks.includes(perk)} onChange={() => togglePerk(perk)} />
                  {perk}
                </label>
              ))}
            </div>

            <h3 style={styles.sectionTitle}>❓ Application Screening Questions</h3>
            {driveData.questions.map((question, index) => (
              <div key={question.id} style={styles.questionItem}>
                <input type="text" value={question.text} onChange={(e) => updateQuestion(index, "text", e.target.value)} placeholder="e.g., Years of experience in Java?" style={{ ...styles.input, flex: 1, minWidth: "180px" }} />
                <select value={question.type} onChange={(e) => updateQuestion(index, "type", e.target.value)} style={{ ...styles.select, flex: "0 0 170px" }}>
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeQuestion(index)} style={styles.buttonDanger}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addQuestion} style={styles.buttonAdd}>+ Add Screening Question</button>

            <div style={styles.formGroup}>
              <label style={styles.label}>📄 Upload JD (PDF)</label>
              <input style={styles.input} type="file" accept=".pdf" onChange={handleJDFile} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🔔 Notifications</label>
              <select style={styles.select} value={driveData.notifications} onChange={(e) => updateField("notifications", e.target.value)}>
                {notificationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <h3 style={styles.sectionTitle}>🔁 Recruitment Rounds</h3>
            {driveData.rounds.map((round, index) => (
              <div key={round.id} style={styles.roundBox}>
                <div style={styles.roundHeader}>
                  <h4 style={{ margin: 0 }}>Round {index + 1}</h4>
                  <button type="button" onClick={() => removeRound(index)} style={styles.buttonDanger}>Remove</button>
                </div>
                <div style={styles.rowDuo}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Title</label>
                    <input style={styles.input} value={round.title} onChange={(e) => updateRound(index, "title", e.target.value)} placeholder="Aptitude Test" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Mode</label>
                    <select style={styles.select} value={round.mode} onChange={(e) => updateRound(index, "mode", e.target.value)}>
                      {roundModes.map((mode) => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={styles.rowDuo}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Date</label>
                    <input style={styles.input} type="date" value={round.date} onChange={(e) => updateRound(index, "date", e.target.value)} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Time</label>
                    <input style={styles.input} type="time" value={round.time} onChange={(e) => updateRound(index, "time", e.target.value)} />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <input style={styles.input} value={round.desc} onChange={(e) => updateRound(index, "desc", e.target.value)} placeholder="Details about this round" />
                </div>
              </div>
            ))}
            <button type="button" onClick={addRound} style={styles.buttonAdd}>+ Add Round</button>

            <div style={styles.actionButtons}>
              <button type="button" onClick={handleCreateDrive} style={styles.buttonPrimary}>✅ Create Drive & Find Eligible Students</button>
            </div>
          </>
        )}

        {currentStep >= 2 && (
          <div style={styles.studentsSection}>
            <div style={{ ...styles.alert, ...styles.alertInfo }}>
              <strong>📌 Drive:</strong> {driveData.company} | <strong>Role:</strong> {driveData.jobRole} | <strong>Location:</strong> {driveData.location}
              <div style={{ marginTop: "8px" }}><strong>Eligible Students:</strong> {eligibleStudents.length} | <strong>Notifications:</strong> {driveData.notifications}</div>
            </div>

            <div style={styles.reviewActions}>
              <button type="button" onClick={handleSendDrive} style={styles.buttonSuccess}>📤 Send Drive Details to Eligible Students</button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.studentsTable}>
                <thead>
                  <tr>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Username</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Email</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Department</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Year</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>CGPA</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Arrears</th>
                    <th style={{ ...styles.tableCell, ...styles.tableHead }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td style={styles.tableCell}>{student.username || student.email}</td>
                      <td style={styles.tableCell}>{student.email || "-"}</td>
                      <td style={styles.tableCell}>{student.department || "-"}</td>
                      <td style={styles.tableCell}>{student.year || "-"}</td>
                      <td style={styles.tableCell}>{student.cgpa ?? "-"}</td>
                      <td style={styles.tableCell}>{student.current_arrears ?? student.arrears_count ?? "-"}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          background: "#e0f2fe",
                          padding: "4px 10px",
                          borderRadius: "18px",
                          fontSize: "0.8rem",
                          color: "#075985",
                          fontWeight: 600,
                        }}>
                          Eligible
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ ...styles.studentsSection, marginTop: "30px" }}>
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>
              <strong>✅ Drive Sent Successfully!</strong> Drive details sent to {eligibleStudents.length} eligible students.
            </div>
            <div style={styles.actionButtons}>
              <button type="button" onClick={() => navigate("/placement/dashboard")} style={{ ...styles.buttonPrimary, fontSize: "1rem", padding: "12px 28px" }}>
                📊 Back to Dashboard
              </button>
            </div>
            {sendMessage && <div style={{ ...styles.toastMessage, marginTop: "18px" }}>{sendMessage}</div>}
          </div>
        )}

        {toastMessage && (
          <div style={{ ...styles.toastMessage, color: toastError ? "#991b1c" : "#065f46" }}>{toastMessage}</div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";

const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DEPARTMENTS = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "MECHANICAL"];
const HOSTEL_TYPES = ["Boys", "Girls"];
const ROLE_LABELS = {
  hod: "HOD",
  faculty_fa: "Faculty Advisor",
  faculty_subject: "Subject Faculty",
  librarian: "Librarian",
  placement_officer: "Placement Officer",
  association_advisor: "Association Advisor",
  hostel_warden: "Hostel Warden",
};

const ROLE_FORMS = {
  hod: {
    title: "HOD Registration",
    description: "Register a Head of Department with department and approval details.",
    designation: "hod",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "emergency_contact", label: "Emergency Contact Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "id_number", label: "Staff ID / Employee Code", type: "text", required: true },
      { name: "department_managed", label: "Department Managed", type: "select", options: DEPARTMENTS },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "experience", label: "Experience in Years", type: "text" },
      { name: "room_number", label: "Office Cabin Number", type: "text" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Qualification Certificates Upload", type: "file" },
      { name: "resume", label: "Resume / CV Upload", type: "file" },
      { name: "appointment_order", label: "Appointment Order PDF Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  faculty_fa: {
    title: "Faculty Advisor Registration",
    description: "Register a Faculty Advisor with subject handling and class-in-charge details.",
    designation: "faculty_fa",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "emergency_contact", label: "Emergency Contact Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "id_number", label: "Staff ID / Employee Code", type: "text", required: true },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "department", label: "Department", type: "select", options: DEPARTMENTS },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "subjects", label: "Subjects Handled", type: "text" },
      { name: "semester_handling", label: "Semester Handling", type: "text" },
      { name: "experience", label: "Experience in Years", type: "text" },
      { name: "class_incharge_details", label: "Class In-Charge Details", type: "textarea" },
      { name: "room_number", label: "Office Room Number", type: "text" },
      { name: "certifications", label: "Certifications", type: "textarea" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Qualification Certificates Upload", type: "file" },
      { name: "resume", label: "Resume / CV Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  faculty_subject: {
    title: "Subject Faculty Registration",
    description: "Register a Subject Faculty with subjects and semester assignments.",
    designation: "faculty_subject",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "emergency_contact", label: "Emergency Contact Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "id_number", label: "Staff ID / Employee Code", type: "text", required: true },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "department", label: "Department", type: "select", options: DEPARTMENTS },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "subjects", label: "Subjects Handled", type: "text" },
      { name: "semester_handling", label: "Semester Handling", type: "text" },
      { name: "experience", label: "Experience in Years", type: "text" },
      { name: "room_number", label: "Office Room Number", type: "text" },
      { name: "certifications", label: "Certifications", type: "textarea" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Qualification Certificates Upload", type: "file" },
      { name: "resume", label: "Resume / CV Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  hostel_warden: {
    title: "Hostel Warden Registration",
    description: "Register a Hostel Warden with hostel assignment details.",
    designation: "hostel_warden",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "emergency_contact", label: "Emergency Contact Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "hostel_name", label: "Hostel Name", type: "text" },
      { name: "block_assigned", label: "Block Assigned", type: "text" },
      { name: "floor_assigned", label: "Floor Assigned", type: "text" },
      { name: "hostel_type", label: "Boys / Girls Hostel Type", type: "select", options: HOSTEL_TYPES },
      { name: "duty_timing", label: "Duty Timing", type: "text" },
      { name: "id_number", label: "Staff ID", type: "text", required: true },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "experience", label: "Experience", type: "text" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  placement_officer: {
    title: "Placement Officer Registration",
    description: "Register a Placement Officer with placement coordination details.",
    designation: "placement_officer",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "official_whatsapp", label: "Official WhatsApp Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "id_number", label: "Staff ID", type: "text", required: true },
      { name: "department", label: "Department", type: "select", options: DEPARTMENTS },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "industry_experience", label: "Industry Experience", type: "text" },
      { name: "companies_coordinated", label: "Companies Coordinated", type: "text" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "room_number", label: "Office Room Number", type: "text" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "resume", label: "Resume / CV Upload", type: "file" },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Certificates Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  librarian: {
    title: "Librarian Registration",
    description: "Register a Librarian with library shift details.",
    designation: "librarian",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "library_id", label: "Library ID", type: "text", required: true },
      { name: "section_managed", label: "Section Managed", type: "text" },
      { name: "shift_timing", label: "Shift Timing", type: "text" },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "experience", label: "Experience", type: "text" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Certificates Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },

  association_advisor: {
    title: "Association Advisor Registration",
    description: "Register an Association Advisor with club and department details.",
    designation: "association_advisor",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "age", label: "Age", type: "text", readOnly: true },
      { name: "gender", label: "Gender", type: "select", options: GENDERS },
      { name: "blood_group", label: "Blood Group", type: "select", options: BLOOD_GROUPS },
      { name: "address", label: "Residential Address", type: "textarea" },
      { name: "mobile", label: "Mobile Number", type: "text" },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "profile_photo", label: "Profile Photo Upload", type: "file" },
      { name: "association_name", label: "Association / Club Name", type: "text" },
      { name: "department", label: "Department", type: "select", options: DEPARTMENTS },
      { name: "id_number", label: "Staff ID", type: "text", required: true },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "experience", label: "Experience", type: "text" },
      { name: "joining_year", label: "Year of Joining", type: "text" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      { name: "confirm_password", label: "Confirm Password", type: "password", required: true },
      { name: "id_card", label: "ID Card Upload", type: "file" },
      { name: "qualification_certificates", label: "Certificates Upload", type: "file" },
      { name: "account_approval_status", label: "Account Approval Status", type: "text", readOnly: true, defaultValue: "Pending Approval" },
    ],
  },
};

const ROLE_ORDER = [
  "hod",
  "faculty_fa",
  "faculty_subject",
  "librarian",
  "placement_officer",
  "association_advisor",
  "hostel_warden",
];

const initialFormState = {
  name: "",
  dob: "",
  age: "",
  gender: "",
  blood_group: BLOOD_GROUPS[0],
  address: "",
  mobile: "",
  emergency_contact: "",
  email: "",
  profile_photo: null,
  id_number: "",
  username: "",
  department: DEPARTMENTS[0],
  department_managed: "",
  qualification: "",
  experience: "",
  room_number: "",
  joining_year: new Date().getFullYear().toString(),
  subjects: "",
  subjects_handled: "",
  semester_handling: "",
  class_incharge_details: "",
  hostel_name: "",
  block_assigned: "",
  floor_assigned: "",
  hostel_type: HOSTEL_TYPES[0],
  duty_timing: "",
  official_whatsapp: "",
  industry_experience: "",
  companies_coordinated: "",
  library_id: "",
  section_managed: "",
  shift_timing: "",
  association_name: "",
  certifications: "",
  qualification_certificates: null,
  resume: null,
  appointment_order: null,
  id_card: null,
  password: "",
  confirm_password: "",
  account_approval_status: "Pending Approval",
};

export default function StaffRegister() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = role ? ROLE_FORMS[role] : null;

  useEffect(() => {
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const ageValue = Math.abs(new Date(Date.now() - dobDate.getTime()).getUTCFullYear() - 1970).toString();
      setFormData((prev) => ({ ...prev, age: ageValue }));
    }
  }, [formData.dob]);

  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const buildFormData = () => {
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value === null || value === undefined) return;
      if (value instanceof File) {
        payload.append(key, value);
      } else {
        payload.append(key, value);
      }
    });
    payload.append("designation", roleConfig.designation);
    return payload;
  };

  const handleSubmit = async () => {
    setError("");
    if (!roleConfig) return;

    const requiredFields = roleConfig.fields.filter((field) => field.required).map((field) => field.name);
    for (const name of requiredFields) {
      if (!formData[name]) {
        setError(`Please fill in the ${name.replace(/_/g, " ")} field.`);
        return;
      }
    }

    if (formData.password !== formData.confirm_password) {
      setError("Password and confirm password must match.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildFormData();
      const res = await API.post("api/register/staff/", payload, false);
      if (res?.success || res?.id) {
        navigate(`/staff/register/status?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(res?.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Could not register staff. Please try again later.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    if (field.type === "textarea") {
      return (
        <textarea
          style={{ width: "100%", padding: "10px" }}
          value={value}
          readOnly={field.readOnly}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          style={{ width: "100%", padding: "10px" }}
          value={value}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
          disabled={field.readOnly}
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "file") {
      return (
        <input
          type="file"
          style={{ width: "100%", padding: "10px" }}
          onChange={(e) => handleFileChange(field.name, e.target.files[0] || null)}
        />
      );
    }

    return (
      <input
        type={field.type || "text"}
        style={{ width: "100%", padding: "10px" }}
        value={value}
        readOnly={field.readOnly}
        onChange={(e) => handleValueChange(field.name, e.target.value)}
      />
    );
  };

  if (!roleConfig) {
    return (
      <div style={{ padding: "24px", maxWidth: "960px", margin: "auto" }}>
        <h2>Select Staff Registration Type</h2>
        <p>Choose the staff role to see the dedicated registration form.</p>

        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {ROLE_ORDER.map((roleKey) => (
            <button
              key={roleKey}
              type="button"
              onClick={() => navigate(`/staff/register/${roleKey}`)}
              style={{
                textAlign: "left",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{ROLE_LABELS[roleKey]}</h3>
              <p style={{ marginBottom: 0, color: "#555" }}>{ROLE_FORMS[roleKey].description}</p>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <Link to="/staff/login" style={{ color: "#1976d2" }}>
            Back to staff login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "840px", margin: "auto" }}>
      <h2>{roleConfig.title}</h2>
      <p>{roleConfig.description}</p>
      {error && (
        <div style={{ marginBottom: "16px", color: "#b00020" }}>{error}</div>
      )}

      <div style={{ display: "grid", gap: "14px" }}>
        {roleConfig.fields.map((field) => (
          <label key={field.name}>
            {field.label}
            {renderField(field)}
          </label>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ padding: "12px 18px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>
      </div>

      <div style={{ marginTop: "18px" }}>
        <button
          type="button"
          onClick={() => navigate("/staff/register")}
          style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer" }}
        >
          Choose another staff registration type
        </button>
      </div>
    </div>
  );
}

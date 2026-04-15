import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const departments = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "MECHANICAL"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const sections = ["A", "B", "C", "D"];

export default function StudentRegister() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [mobile, setMobile] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [joiningYear, setJoiningYear] = useState(new Date().getFullYear().toString());
  const [photoFile, setPhotoFile] = useState(null);
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState(bloodGroups[0]);
  const [section, setSection] = useState(sections[0]);
  const [semester, setSemester] = useState(semesters[0]);
  const [advisorFacultyId, setAdvisorFacultyId] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const calculateAge = (dobValue) => {
    if (!dobValue) return "";
    const dobDate = new Date(dobValue);
    const diffMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  const handleDobChange = (value) => {
    setDob(value);
    setAge(calculateAge(value));
  };

  const handleSubmit = async () => {
    if (!name || !dob || !registerNumber || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await API.post("api/register/student/", {
        name,
        dob,
        age,
        department,
        mobile,
        parentMobile,
        register_number: registerNumber,
        joining_year: joiningYear,
        photo_filename: photoFile?.name || "",
        address,
        blood_group: bloodGroup,
        section,
        semester,
        advisor_faculty_id: advisorFacultyId,
        emergency_contact: emergencyContact,
        email,
        password,
      });

      if (res?.success || res?.id) {
        alert("Registration successful. Please login.");
        navigate("/student/login");
      } else {
        alert(res?.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not register student. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "auto" }}>
      <h2>Student Registration</h2>
      <p>Fill in the details below to create a student account with your college register number.</p>

      <div style={{ display: "grid", gap: "14px" }}>
        <label>
          Name
          <input style={{ width: "100%", padding: "10px" }} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            style={{ width: "100%", padding: "10px" }}
            value={dob}
            onChange={(e) => handleDobChange(e.target.value)}
          />
        </label>

        <label>
          Age
          <input style={{ width: "100%", padding: "10px" }} value={age} readOnly />
        </label>

        <label>
          Department
          <select style={{ width: "100%", padding: "10px" }} value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mobile Number
          <input style={{ width: "100%", padding: "10px" }} value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>

        <label>
          Parent Mobile Number
          <input style={{ width: "100%", padding: "10px" }} value={parentMobile} onChange={(e) => setParentMobile(e.target.value)} />
        </label>

        <label>
          Register Number
          <input style={{ width: "100%", padding: "10px" }} value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
        </label>

        <label>
          Year of Joining
          <input style={{ width: "100%", padding: "10px" }} value={joiningYear} onChange={(e) => setJoiningYear(e.target.value)} />
        </label>

        <label>
          Student Photo
          <input type="file" style={{ width: "100%", padding: "10px" }} onChange={(e) => setPhotoFile(e.target.files[0])} />
        </label>

        <label>
          Residential Address
          <textarea style={{ width: "100%", padding: "10px" }} value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>

        <label>
          Blood Group
          <select style={{ width: "100%", padding: "10px" }} value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          Section
          <select style={{ width: "100%", padding: "10px" }} value={section} onChange={(e) => setSection(e.target.value)}>
            {sections.map((sectionValue) => (
              <option key={sectionValue} value={sectionValue}>
                {sectionValue}
              </option>
            ))}
          </select>
        </label>

        <label>
          Semester
          <select style={{ width: "100%", padding: "10px" }} value={semester} onChange={(e) => setSemester(e.target.value)}>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </label>

        <label>
          Advisor Faculty ID
          <input style={{ width: "100%", padding: "10px" }} value={advisorFacultyId} onChange={(e) => setAdvisorFacultyId(e.target.value)} />
        </label>

        <label>
          Emergency Contact
          <input style={{ width: "100%", padding: "10px" }} value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
        </label>

        <label>
          Email ID
          <input style={{ width: "100%", padding: "10px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input type="password" style={{ width: "100%", padding: "10px" }} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button
          onClick={handleSubmit}
          style={{ padding: "12px 18px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Register Student
        </button>
      </div>

      <div style={{ marginTop: "18px" }}>
        <Link to="/student/login" style={{ color: "#1976d2" }}>
          Back to student login
        </Link>
      </div>
    </div>
  );
}

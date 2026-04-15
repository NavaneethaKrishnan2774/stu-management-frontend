import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const departments = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "MECHANICAL"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function StaffRegister() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [mobile, setMobile] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [joiningYear, setJoiningYear] = useState(new Date().getFullYear().toString());
  const [photoFile, setPhotoFile] = useState(null);
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState(bloodGroups[0]);
  const [subjects, setSubjects] = useState("");
  const [experience, setExperience] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [qualification, setQualification] = useState("");
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
    if (!name || !dob || !idNumber || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await API.post("api/register/staff/", {
        name,
        dob,
        age,
        department,
        mobile,
        id_number: idNumber,
        joining_year: joiningYear,
        photo_filename: photoFile?.name || "",
        address,
        blood_group: bloodGroup,
        subjects,
        experience,
        room_number: roomNumber,
        qualification,
        email,
        password,
      });

      if (res?.success || res?.id) {
        alert("Staff registration successful. Please login.");
        navigate("/staff/login");
      } else {
        alert(res?.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not register staff. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "auto" }}>
      <h2>Staff Registration</h2>
      <p>Complete the form below to register a new college staff account.</p>

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
          ID Number
          <input style={{ width: "100%", padding: "10px" }} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        </label>
        <label>
          Year of Joining
          <input style={{ width: "100%", padding: "10px" }} value={joiningYear} onChange={(e) => setJoiningYear(e.target.value)} />
        </label>
        <label>
          Staff Photo
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
          Subjects Held
          <input style={{ width: "100%", padding: "10px" }} value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="Comma-separated subjects" />
        </label>
        <label>
          Experience
          <input style={{ width: "100%", padding: "10px" }} value={experience} onChange={(e) => setExperience(e.target.value)} />
        </label>
        <label>
          Office Room Number
          <input style={{ width: "100%", padding: "10px" }} value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        </label>
        <label>
          Qualification
          <input style={{ width: "100%", padding: "10px" }} value={qualification} onChange={(e) => setQualification(e.target.value)} />
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
          Register Staff
        </button>
      </div>

      <div style={{ marginTop: "18px" }}>
        <Link to="/staff/login" style={{ color: "#1976d2" }}>
          Back to staff login
        </Link>
      </div>
    </div>
  );
}

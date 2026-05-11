import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeToken } from "../services/api";

const BASE_URL = "http://127.0.0.1:8000";

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const navigate = useNavigate();
  const token = normalizeToken(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      navigate("/student/login", { replace: true });
      return;
    }

    const fetchStudentProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/students/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.clear();
            navigate("/student/login", { replace: true });
            return;
          }
          throw new Error("Failed to fetch profile data");
        }

        const data = await res.json();
        setStudentData(data);
        setFormData(data);
        if (data.profile_photo) {
          setPhotoPreview(`${BASE_URL}${data.profile_photo}`);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [token, navigate]);

  const handleBackToDashboard = () => {
    navigate("/student/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login", { replace: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    setFormData(prev => ({
      ...prev,
      date_of_birth: dob,
      age: age
    }));
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add photo if selected
      if (photoFile) {
        formDataToSend.append('profile_photo', photoFile);
      }

      const res = await fetch(`${BASE_URL}/api/students/profile/`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await res.json();
      setStudentData(updatedData);
      setIsEditing(false);
      setPhotoFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(studentData);
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(studentData?.profile_photo ? `${BASE_URL}${studentData.profile_photo}` : null);
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "40px",
        textAlign: "center",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}>
        <div style={{
          display: "inline-block",
          width: "50px",
          height: "50px",
          border: "4px solid #e2e8f0",
          borderTopColor: "#667eea",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ marginTop: "16px", color: "#64748b" }}>Loading profile...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "40px",
        textAlign: "center",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: "#fef2f2",
        borderRadius: "20px",
        border: "1px solid #fecaca",
        color: "#991b1b"
      }}>
        <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>⚠️</span>
        <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>{error}</p>
        <button
          onClick={handleBackToDashboard}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "1000px",
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
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>👤 Student Profile</h1>
            <p style={{ opacity: 0.9, margin: 0 }}>{isEditing ? "Edit your profile information" : "View and manage your profile information"}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
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
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleBackToDashboard}
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
                  ← Back to Dashboard
                </button>
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
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    background: "rgba(34,197,94,0.9)",
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
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(34,197,94,1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(34,197,94,0.9)"}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    background: "rgba(239,68,68,0.9)",
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
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.9)"}
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: photoPreview ? `url(${photoPreview})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            color: "white",
            border: "4px solid #e2e8f0"
          }}>
            {!photoPreview && "👨‍🎓"}
          </div>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#1e293b" }}>
              {formData?.first_name} {formData?.last_name}
            </h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "16px" }}>
              {formData?.department} - {formData?.year} Year - Section {formData?.section}
            </p>
            {isEditing && (
              <div style={{ marginTop: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#475569" }}>
                  Profile Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
          {/* Personal Information */}
          <div style={{ padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "#1e293b" }}>👤 Personal Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>First Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData?.first_name || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.first_name || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Last Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData?.last_name || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.last_name || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Date of Birth:</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData?.date_of_birth || ""}
                    onChange={handleDOBChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.date_of_birth || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Age:</label>
                <span style={{ color: "#1e293b" }}>{formData?.age || "Not calculated"}</span>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Blood Group:</label>
                {isEditing ? (
                  <select
                    name="blood_group"
                    value={formData?.blood_group || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.blood_group || "Not provided"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "#1e293b" }}>📞 Contact Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Email ID:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.email || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Student Mobile:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData?.mobile || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.mobile || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Parent Mobile:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="parent_mobile"
                    value={formData?.parent_mobile || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.parent_mobile || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Emergency Contact:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData?.emergency_contact || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.emergency_contact || "Not provided"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div style={{ padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "#1e293b" }}>🎓 Academic Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Register Number:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="register_number"
                    value={formData?.register_number || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.register_number || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Department:</label>
                {isEditing ? (
                  <select
                    name="department"
                    value={formData?.department || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EEE">EEE</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                  </select>
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.department}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Year:</label>
                {isEditing ? (
                  <select
                    name="year"
                    value={formData?.year || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="FY">First Year</option>
                    <option value="SY">Second Year</option>
                    <option value="TY">Third Year</option>
                    <option value="Final">Final Year</option>
                  </select>
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.year} Year</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Section:</label>
                {isEditing ? (
                  <select
                    name="section"
                    value={formData?.section || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                ) : (
                  <span style={{ color: "#1e293b" }}>Section {studentData?.section}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Semester:</label>
                {isEditing ? (
                  <select
                    name="semester"
                    value={formData?.semester || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
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
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.semester ? `Semester ${studentData.semester}` : "Not specified"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Year of Joining:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="year_of_joining"
                    value={formData?.year_of_joining || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.year_of_joining || "Not provided"}</span>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Advisor Faculty ID:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="advisor_faculty_id"
                    value={formData?.advisor_faculty_id || ""}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.advisor_faculty_id || "Not provided"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={{ padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "#1e293b" }}>🏠 Address Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#475569" }}>Residential Address:</label>
                {isEditing ? (
                  <textarea
                    name="residential_address"
                    value={formData?.residential_address || ""}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      resize: "vertical"
                    }}
                  />
                ) : (
                  <span style={{ color: "#1e293b" }}>{studentData?.residential_address || "Not provided"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
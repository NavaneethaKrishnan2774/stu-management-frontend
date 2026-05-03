import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PlacementCreateDrive() {
  const [formData, setFormData] = useState({
    company_name: "",
    drive_date: "",
    department: "",
    criteria: "",
  });
  const [document, setDocument] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Feature coming soon! Placement drive creation API is under development.");
    navigate("/placement/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1>Create Placement Drive</h1>
        <button
          onClick={() => navigate("/placement/dashboard")}
          style={{ padding: "8px 16px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Drive Date</label>
          <input
            type="date"
            name="drive_date"
            value={formData.drive_date}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="ECE">Electronics and Communication Engineering</option>
            <option value="EEE">Electrical and Electronics Engineering</option>
            <option value="MECH">Mechanical Engineering</option>
            <option value="CIVIL">Civil Engineering</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Eligibility Criteria</label>
          <textarea
            name="criteria"
            value={formData.criteria}
            onChange={handleChange}
            placeholder="Enter criteria as JSON, e.g., {'cgpa': '>=8.0', 'arrears': '<=2'}"
            rows={4}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Company Document (Optional)</label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
            accept=".pdf,.doc,.docx"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "12px 24px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}
        >
          Create Drive & Notify Students
        </button>
      </form>
    </div>
  );
}
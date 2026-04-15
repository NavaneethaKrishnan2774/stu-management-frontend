import { useNavigate } from "react-router-dom";

const roles = [
  { value: "hod", label: "HOD", description: "Head of Department" },
  { value: "faculty_fa", label: "Faculty (FA)", description: "Faculty advisor role" },
  { value: "faculty_subject", label: "Faculty (Subject Holder)", description: "Subject teacher role" },
  { value: "librarian", label: "Librarian", description: "Library management" },
  { value: "placement_officer", label: "Placement Officer", description: "Placement coordination" },
  { value: "association_advisor", label: "Association Advisor", description: "College association guidance" },
  { value: "hostel_warden", label: "Hostel Warden", description: "Hostel administration" },
];

export default function StaffRoleSelection() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "auto" }}>
      <h2>College Staff Roles</h2>
      <p>Select your staff role, then login using your college ID and password.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => navigate(`/staff/login?designation=${role.value}`)}
            style={{
              textAlign: "left",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{role.label}</h3>
            <p style={{ marginBottom: 0, color: "#555" }}>{role.description}</p>
          </button>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => navigate("/staff/register")}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            color: "white",
            cursor: "pointer",
          }}
        >
          New staff? Register here
        </button>
      </div>
    </div>
  );
}

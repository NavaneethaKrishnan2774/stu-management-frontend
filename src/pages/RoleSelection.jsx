import { useNavigate } from "react-router-dom";

const options = [
  {
    title: "Student",
    description: "Login with your college register number or create a new account if you are a new student.",
    buttonText: "Student Login",
    path: "/student/login",
  },
  {
    title: "College Staff",
    description: "Choose your staff role, then login using your college ID and password.",
    buttonText: "View Staff Roles",
    path: "/staff/roles",
  },
  {
    title: "Admin",
    description: "Admin login with mobile number and password. Register only if you are authorized.",
    buttonText: "Admin Login",
    path: "/admin/login",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "auto" }}>
      <h1 style={{ marginBottom: "8px" }}>Select Your Role</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Choose student, college staff, or admin to continue. New students can register using the college-provided register number.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {options.map((option) => (
          <div
            key={option.title}
            style={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              backgroundColor: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{option.title}</h2>
            <p style={{ color: "#555", lineHeight: 1.6 }}>{option.description}</p>
            <button
              onClick={() => navigate(option.path)}
              style={{
                marginTop: "18px",
                padding: "12px 18px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {option.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const modules = [
    { name: "Academic", path: "/academics" },
    { name: "Administrative", path: "/administration" },
    { name: "Development", path: "/development" },
    { name: "Communication", path: "/communication" },
    { name: "Analytics", path: "/analytics" },
    { name: "Navigation", path: "/navigation" },
  ];

  return (
    <div>
      <h2>Student Dashboard</h2>

      {/* Summary */}
      <div>
        <h3>Summary</h3>
        <p>Attendance: 82%</p>
        <p>Next Exam: Math - 25th</p>
        <p>Placement: Infosys Drive Soon</p>
      </div>

      {/* Modules */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {modules.map((m, index) => (
          <div
            key={index}
            onClick={() => navigate(m.path)}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#2196F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
            }}
          >
            {m.name}
          </div>
        ))}
      </div>
    </div>
  );
}
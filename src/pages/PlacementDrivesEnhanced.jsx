import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PlacementDrivesEnhanced() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState("1");
  const [filterType, setFilterType] = useState("all");
  const [roundFilter, setRoundFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});

  const departments = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];
  const years = ["1", "2", "3", "4"];
  const filters = [
    { value: "all", label: "All Students" },
    { value: "placed", label: "Placed Students" },
    { value: "offers_2", label: "2+ Offers" },
    { value: "offers_3", label: "3+ Offers" },
    { value: "offers_4", label: "4+ Offers" },
    { value: "offers_5", label: "5+ Offers" },
  ];
  const roundFilters = [
    { value: "all", label: "All Rounds" },
    { value: "first", label: "First Round Cleared" },
    { value: "second", label: "Second Round Cleared" },
    { value: "third", label: "Third Round Cleared" },
    { value: "final", label: "Final Round Cleared" },
  ];

  useEffect(() => {
    fetchStudents();
  }, [department, year, filterType, roundFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        department,
        year,
        filter: filterType,
        round: roundFilter,
      };
      const response = await API.get("api/students/placement/students-filtered/", params);

      setStudents(response.students || []);
      setStatistics({
        total: response.total_students || 0,
        filtered: response.filtered_students || 0,
        placed: response.placed_count || 0,
      });
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
    }
    setLoading(false);
  };

  const getRoundColor = (rounds) => {
    if (!rounds || rounds.length === 0) return "#ffffff";
    if (rounds.includes("final")) return "#90EE90"; // Light green - final round
    if (rounds.includes("third")) return "#87CEEB"; // Sky blue - third round
    if (rounds.includes("second")) return "#FFD700"; // Gold - second round
    if (rounds.includes("first")) return "#FFA500"; // Orange - first round
    return "#ffffff";
  };

  const renderTooltip = (student) => {
    let tooltip = `Register: ${student.register_number}\n`;
    tooltip += `CGPA: ${student.cgpa}\n`;
    tooltip += `Current Arrears: ${student.current_arrears}\n`;
    tooltip += `Offers: ${student.total_offers}\n`;
    if (student.rounds_cleared.length > 0) {
      tooltip += `Rounds: ${student.rounds_cleared.join(", ")}\n`;
    }
    return tooltip;
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h1>Placement Drive Dashboard</h1>
          <button
            onClick={() => navigate("/placement/dashboard")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Statistics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2196f3" }}>{statistics.total}</div>
            <div style={{ color: "#666", marginTop: "8px" }}>Total Students in {department} - Year {year}</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4caf50" }}>{statistics.placed}</div>
            <div style={{ color: "#666", marginTop: "8px" }}>Placed Students</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>{statistics.filtered}</div>
            <div style={{ color: "#666", marginTop: "8px" }}>Filtered Results</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "16px" }}>Filters</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "16px" }}>
          {/* Department Filter */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>
          </div>

          {/* Student Filter */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Student Status</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {filters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Round Filter */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Round Clearance</label>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {roundFilters.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#90EE90", borderRadius: "4px" }}></div>
            <span>Final Round Cleared</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#87CEEB", borderRadius: "4px" }}></div>
            <span>Third Round Cleared</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#FFD700", borderRadius: "4px" }}></div>
            <span>Second Round Cleared</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#FFA500", borderRadius: "4px" }}></div>
            <span>First Round Cleared</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#E8F5E9", border: "1px solid #4caf50", borderRadius: "4px" }}></div>
            <span style={{ color: "#4caf50", fontWeight: "bold" }}>Placed</span>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading students...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No students found</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Reg. No.</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Class</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>CGPA</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Arrears</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Offers</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Contact</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: student.placed ? "#E8F5E9" : getRoundColor(student.rounds_cleared),
                      transition: "background-color 0.2s",
                    }}
                    title={renderTooltip(student)}
                    onMouseOver={(e) => {
                      if (!student.placed) {
                        e.currentTarget.style.backgroundColor = "rgba(33, 150, 243, 0.05)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = student.placed
                        ? "#E8F5E9"
                        : getRoundColor(student.rounds_cleared);
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <strong>{student.name}</strong>
                    </td>
                    <td style={{ padding: "12px", color: "#666" }}>{student.register_number}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {student.year}/{student.section}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "500" }}>{student.cgpa.toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span
                        style={{
                          backgroundColor: student.current_arrears > 0 ? "#FFEBEE" : "#E8F5E9",
                          color: student.current_arrears > 0 ? "#c62828" : "#2e7d32",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {student.current_arrears}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "500" }}>{student.total_offers}</td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "#666" }}>
                      <div>{student.mobile}</div>
                      <div>{student.email}</div>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {student.placed ? (
                        <span
                          style={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          ✓ Placed
                        </span>
                      ) : student.rounds_cleared.length > 0 ? (
                        <span
                          style={{
                            backgroundColor: "#ff9800",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {student.rounds_cleared[student.rounds_cleared.length - 1]} Round
                        </span>
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>Applied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "24px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        Showing {students.length} of {statistics.total} students
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlacementDrives() {
  const [drives] = useState([]);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1>Placement Drives</h1>
        <div>
          <button
            onClick={() => navigate("/placement/create-drive")}
            style={{ padding: "8px 16px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" }}
          >
            Create New Drive
          </button>
          <button
            onClick={() => navigate("/placement/dashboard")}
            style={{ padding: "8px 16px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Company</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Department</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Applied</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Placed</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Document</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Criteria</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr key={drive.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{drive.company_name}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{drive.drive_date}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{drive.department}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{drive.applied_count}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{drive.placed_count}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {drive.document ? (
                    <a href={drive.document} target="_blank" rel="noopener noreferrer">View</a>
                  ) : "N/A"}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {drive.criteria || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drives.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "32px", color: "#666" }}>No placement drives found.</p>
      )}
    </div>
  );
}
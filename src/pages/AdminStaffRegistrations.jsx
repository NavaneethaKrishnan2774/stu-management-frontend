import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminStaffRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    fetchRegistrations(token);
  }, []);

  const fetchRegistrations = async (token) => {
    try {
      const data = await API.get("api/admin/staff-registrations/", token);
      setRegistrations(data);
    } catch (err) {
      setError(err?.message || "Unable to load staff registrations.");
    } finally {
      setLoading(false);
    }
  };

  const formatRoleLabel = (roleValue) => {
    const roleLabels = {
      hod: "HOD",
      faculty_fa: "Faculty (FA)",
      faculty_subject: "Faculty (Subject Holder)",
      librarian: "Librarian",
      placement_officer: "Placement Officer",
      association_advisor: "Association Advisor",
      hostel_warden: "Hostel Warden",
    };
    return roleLabels[roleValue] || roleValue.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleApproval = async (registrationId, action, rejectionReason = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await API.post(`api/admin/approve-staff/${registrationId}/`, {
        action,
        rejection_reason: rejectionReason,
      }, token);

      alert(response.message);
      // Refresh the list
      fetchRegistrations(token);
    } catch (err) {
      alert(err?.message || "Action failed.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { backgroundColor: "#fff3cd", color: "#856404" },
      approved: { backgroundColor: "#d4edda", color: "#155724" },
      rejected: { backgroundColor: "#f8d7da", color: "#721c24" },
    };

    return (
      <span style={{
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        ...styles[status]
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <p>Loading staff registrations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1>Staff Registration Approvals</h1>
        <p>Review and approve/reject staff registration requests.</p>
      </div>

      {registrations.length === 0 ? (
        <p>No staff registration requests found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {registrations.map((reg) => (
            <div
              key={reg.id}
              style={{
                padding: "20px",
                border: "1px solid #e3e8ef",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>{reg.name}</h3>
                  <p style={{ margin: "0", color: "#7f8c8d" }}>
                    <strong>Email:</strong> {reg.email}
                  </p>
                  <p style={{ margin: "0", color: "#7f8c8d" }}>
                    <strong>ID:</strong> {reg.id_number} | <strong>Department:</strong> {reg.department}
                  </p>
                  <p style={{ margin: "0", color: "#7f8c8d" }}>
                    <strong>Role:</strong> {formatRoleLabel(reg.designation)}
                  </p>
                  <p style={{ margin: "0", color: "#7f8c8d" }}>
                    <strong>Applied:</strong> {new Date(reg.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  {getStatusBadge(reg.status)}
                  {reg.approved_by && (
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}>
                      {reg.status === 'approved' ? 'Approved' : 'Rejected'} by {reg.approved_by}
                      {reg.approved_at && ` on ${new Date(reg.approved_at).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>

              {reg.status === 'pending' && (
                <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => handleApproval(reg.id, 'approve')}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter rejection reason:");
                      if (reason !== null) {
                        handleApproval(reg.id, 'reject', reason);
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {reg.status === 'rejected' && reg.rejection_reason && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f8d7da",
                  border: "1px solid #f5c6cb",
                  borderRadius: "6px",
                }}>
                  <strong>Rejection Reason:</strong> {reg.rejection_reason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
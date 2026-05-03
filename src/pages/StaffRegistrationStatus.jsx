import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const roleLabels = {
  hod: "HOD",
  faculty_fa: "Faculty (FA)",
  faculty_subject: "Faculty (Subject Holder)",
  librarian: "Librarian",
  placement_officer: "Placement Officer",
  association_advisor: "Association Advisor",
  hostel_warden: "Hostel Warden",
};

export default function StaffRegistrationStatus() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const fetchStatus = async () => {
    if (!email) {
      setError("Registration email is required to check status.");
      setLoading(false);
      return;
    }

    try {
      const data = await API.get(`api/register/staff-status/?email=${encodeURIComponent(email)}`);
      setStatusData(data);
    } catch (err) {
      setError(err?.message || "Unable to load registration status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [email]);

  const renderActions = () => {
    if (!statusData) return null;

    if (statusData.status === "approved") {
      return (
        <button
          onClick={() => navigate(`/staff/login?designation=${encodeURIComponent(statusData.role)}`)}
          style={{ padding: "12px 18px", backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Go to Login
        </button>
      );
    }

    if (statusData.status === "rejected") {
      return (
        <button
          onClick={() => navigate("/staff/register")}
          style={{ padding: "12px 18px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Register Again
        </button>
      );
    }

    return (
      <button
        onClick={fetchStatus}
        style={{ padding: "12px 18px", backgroundColor: "#f0ad4e", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer" }}
      >
        Refresh Status
      </button>
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "auto" }}>
      <h2>Staff Registration Status</h2>
      <p>Track your registration and admin approval status.</p>

      {loading && <p>Loading registration status...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {statusData && (
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #e3e8ef", borderRadius: "12px", backgroundColor: "#fff" }}>
          <p><strong>Name:</strong> {statusData.name}</p>
          <p><strong>Email:</strong> {statusData.email}</p>
          <p><strong>Department:</strong> {statusData.department}</p>
          <p><strong>Role:</strong> {roleLabels[statusData.role] || statusData.role}</p>
          <p><strong>Status:</strong> {statusData.status.charAt(0).toUpperCase() + statusData.status.slice(1)}</p>
          {statusData.status === "approved" && statusData.approved_at && (
            <p><strong>Approved At:</strong> {new Date(statusData.approved_at).toLocaleString()}</p>
          )}
          {statusData.status === "rejected" && statusData.rejection_reason && (
            <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: "6px" }}>
              <strong>Rejection Reason:</strong>
              <p style={{ margin: "8px 0 0 0" }}>{statusData.rejection_reason}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", gap: "14px", alignItems: "center" }}>
        {renderActions()}
        <Link to="/staff/register" style={{ color: "#1976d2" }}>
          Back to registration
        </Link>
      </div>
    </div>
  );
}

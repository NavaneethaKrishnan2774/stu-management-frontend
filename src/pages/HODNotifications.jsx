import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { normalizeToken } from "../services/api";

const YEAR_OPTIONS = ["1", "2", "3", "4"];
const SECTION_OPTIONS = ["A", "B", "C"];
const TARGET_OPTIONS = [
  { value: "all", label: "All" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
];

export default function HODNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [year, setYear] = useState("all");
  const [section, setSection] = useState("all");
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [file, setFile] = useState(null);
  const [editingNotificationId, setEditingNotificationId] = useState(null);

  const token = normalizeToken(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/hod/login", { replace: true });
    }
  }, [token, navigate]);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("designation");
    localStorage.removeItem("department");
    localStorage.removeItem("year");
    localStorage.removeItem("section");
    navigate("/hod/login", { replace: true });
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        handleUnauthorized();
        return;
      }
      const data = await API.get("api/students/hod/sent-notifications/", token);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.status === 403) {
        handleUnauthorized();
        return;
      }
      setError(err?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffOptions = async () => {
    try {
      if (!token) return;
      const data = await API.get("api/students/available-faculties/", token);
      setStaffOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.status === 403) {
        handleUnauthorized();
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchStaffOptions();
    }
  }, [token]);

  useEffect(() => {
    if (target !== "staff") {
      setSelectedStaffIds([]);
    }
  }, [target]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setTarget("all");
    setYear("all");
    setSection("all");
    setSelectedStaffIds([]);
    setScheduledTime("");
    setFile(null);
    setEditingNotificationId(null);
    setError(null);
    setSuccess(null);
  };

  const handleNotificationSubmit = async () => {
    setSuccess(null);
    setError(null);

    if (title.trim().length < 5 || message.trim().length < 10) {
      setError("Please enter a title and a longer message.");
      return;
    }

    // Allow all years or all sections for student notifications.

    try {
      if (!token) throw new Error("Authentication token missing.");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("message", message.trim());
      formData.append("target", target);
      formData.append("year", year);
      formData.append("section", section);
      if (scheduledTime) {
        formData.append("scheduled_time", new Date(scheduledTime).toISOString());
      }
      if (file) {
        formData.append("file", file);
      }
      if (target === "staff" && selectedStaffIds.length > 0) {
        selectedStaffIds.forEach((id) => formData.append("staff_ids", id));
      }

      if (editingNotificationId) {
        await API.put(`api/students/hod/edit-notification/${editingNotificationId}/`, formData, token);
        setSuccess("Notification updated successfully.");
      } else {
        await API.post("api/students/create-notification/", formData, token);
        setSuccess("Notification sent successfully.");
      }

      resetForm();
      fetchNotifications();
    } catch (err) {
      setError(err?.message || "Unable to send notification.");
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotificationId(notification.id);
    setTitle(notification.title || "");
    setMessage(notification.message || "");
    setTarget(notification.recipient_role === "staff" ? "staff" : "students");
    setYear(notification.year || "all");
    setSection(notification.section || "all");
    setSelectedStaffIds(notification.recipient_id ? [notification.recipient_id] : []);
    setScheduledTime(notification.scheduled_time ? new Date(notification.scheduled_time).toISOString().slice(0, 16) : "");
    setFile(null);
    setSuccess(null);
    setError(null);
  };

  const handleDeleteNotification = async (id) => {
    setError(null);
    setSuccess(null);
    try {
      if (!token) throw new Error("Authentication token missing.");
      await API.delete(`api/students/hod/delete-notification/${id}/`, token);
      setSuccess("Notification deleted.");
      if (editingNotificationId === id) {
        resetForm();
      }
      fetchNotifications();
    } catch (err) {
      setError(err?.message || "Unable to delete notification.");
    }
  };

  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const allStaffIds = staffOptions.map((staff) => staff.id);

  const toggleStaffDropdown = () => setShowStaffDropdown((open) => !open);
  const selectAllStaff = () => setSelectedStaffIds(allStaffIds);
  const clearStaffSelection = () => setSelectedStaffIds([]);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>HOD Notifications</h1>
          <p>Compose notifications for students or staff, then manage sent messages.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: "24px", marginBottom: "32px" }}>
        <div style={{ padding: "22px", borderRadius: "18px", backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(32, 57, 91, 0.04)" }}>
          <h2 style={{ marginBottom: "16px" }}>{editingNotificationId ? "Edit Notification" : "Create Notification"}</h2>

          <label style={labelStyle}>Target</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle}>
            {TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label style={labelStyle}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="Enter notification title" />

          <label style={labelStyle}>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...inputStyle, minHeight: "120px" }} placeholder="Enter notification message" />

          {target === "students" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle}>
                  <option value="all">All years</option>
                  {YEAR_OPTIONS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Section</label>
                <select value={section} onChange={(e) => setSection(e.target.value)} style={inputStyle}>
                  <option value="all">All sections</option>
                  {SECTION_OPTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {target === "staff" && (
            <>
              <label style={labelStyle}>Staff recipients</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{ ...buttonStyle, width: "auto", padding: "10px 14px", minWidth: "140px" }}
                  onClick={toggleStaffDropdown}
                >
                  {selectedStaffIds.length > 0
                    ? `Selected ${selectedStaffIds.length} staff`
                    : "Choose staff recipients"}
                </button>
                <button
                  type="button"
                  style={{ ...buttonStyle, width: "auto", padding: "10px 14px", minWidth: "140px", backgroundColor: "#777" }}
                  onClick={selectAllStaff}
                >
                  Select all
                </button>
                <button
                  type="button"
                  style={{ ...buttonStyle, width: "auto", padding: "10px 14px", minWidth: "140px", backgroundColor: "#aaa" }}
                  onClick={clearStaffSelection}
                >
                  Clear
                </button>
              </div>

              {showStaffDropdown && (
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      zIndex: 20,
                      padding: "12px",
                      backgroundColor: "#fff",
                      border: "1px solid #d2d6dc",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      maxHeight: "260px",
                      overflowY: "auto",
                    }}
                  >
                    {staffOptions.length === 0 && <p style={{ color: "#666" }}>No staff available</p>}
                    {staffOptions.map((staff) => {
                      const checked = selectedStaffIds.includes(staff.id);
                      return (
                        <label
                          key={staff.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setSelectedStaffIds((prev) => prev.filter((id) => id !== staff.id));
                              } else {
                                setSelectedStaffIds((prev) => [...prev, staff.id]);
                              }
                            }}
                          />
                          <span>{`${staff.full_name || staff.username} (${staff.designation || staff.role || "Staff"})`}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              <p style={{ color: "#555", fontSize: "13px", marginTop: "-4px", marginBottom: "16px" }}>
                Use the dropdown to tick specific staff recipients. Leave all unselected to send to all department staff.
              </p>
            </>
          )}

          <label style={labelStyle}>Schedule date/time</label>
          <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Attachment</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={inputStyle} />

          {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "16px" }}>{success}</p>}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={buttonStyle} onClick={handleNotificationSubmit}>
              {editingNotificationId ? "Update Notification" : "Send Notification"}
            </button>
            {editingNotificationId && (
              <button style={{ ...buttonStyle, backgroundColor: "#777" }} onClick={resetForm} type="button">
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: "22px", borderRadius: "18px", backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(32, 57, 91, 0.04)" }}>
          <h2 style={{ marginBottom: "16px" }}>Sent Notifications</h2>
          {loading && <p>Loading notifications...</p>}
          {!loading && notifications.length === 0 && <p style={{ color: "#555" }}>No notifications have been sent yet.</p>}
          {!loading && notifications.length > 0 && (
            <div style={{ maxHeight: "560px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Title</th>
                    <th style={tableHeader}>Target</th>
                    <th style={tableHeader}>Recipient</th>
                    <th style={tableHeader}>Department</th>
                    <th style={tableHeader}>Year</th>
                    <th style={tableHeader}>Section</th>
                    <th style={tableHeader}>Schedule</th>
                    <th style={tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td style={tableCell}>{notification.title}</td>
                      <td style={tableCell}>{notification.recipient_role || "all"}</td>
                      <td style={tableCell}>{notification.recipient_username || "all"}</td>
                      <td style={tableCell}>{notification.department || "all"}</td>
                      <td style={tableCell}>{notification.year || "all"}</td>
                      <td style={tableCell}>{notification.section || "all"}</td>
                      <td style={tableCell}>{notification.scheduled_time ? new Date(notification.scheduled_time).toLocaleString() : "Immediately"}</td>
                      <td style={tableCell}>
                        <button style={{ ...actionButton, backgroundColor: "#1976d2" }} onClick={() => handleEditNotification(notification)}>
                          Edit
                        </button>
                        <button style={{ ...actionButton, backgroundColor: "#d32f2f" }} onClick={() => handleDeleteNotification(notification.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #d2d6dc",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  marginTop: "12px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#1976d2",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const tableHeader = {
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f7f7f7",
};

const tableCell = {
  padding: "12px 14px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};

const actionButton = {
  padding: "8px 12px",
  marginRight: "8px",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
};
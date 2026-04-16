import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_ORDER = [
  "9:00-9:50",
  "9:50-10:40",
  "11:00-11:50",
  "11:50-12:40",
  "1:25-2:15",
  "2:15-3:05",
  "3:20-4:10",
  "4:10-5:00",
];

const getSubjectAbbreviation = (entry) => {
  if (!entry) return "N/A";
  if (entry.subject_code) return entry.subject_code;
  const words = (entry.subject || "").split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((w) => w[0]).join('').toUpperCase().slice(0, 6);
  }
  return (entry.subject || 'N/A').slice(0, 6).toUpperCase();
};

export default function HODTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [commentById, setCommentById] = useState({});
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    const fetchTimetables = API.get("api/students/hod/timetables/", token)
      .then((data) => setTimetables(data.timetables || []))
      .catch((err) => setError(err?.message || "Unable to load timetable entries."));

    const fetchFaculties = API.get("api/students/available-faculties/", token)
      .then((data) => {
        const unique = Array.isArray(data)
          ? Array.from(new Map(data.map((faculty) => [faculty.id, faculty])).values())
          : [];
        setFacultyOptions(unique);
      })
      .catch(() => {
        // ignore faculty load failure
      });

    Promise.all([fetchTimetables, fetchFaculties]).finally(() => setLoading(false));
  }, []);

  const classGroups = useMemo(() => {
    return timetables.reduce((groups, item) => {
      const groupKey = `${item.department || ""}|${item.year || ""}|${item.section || ""}|${item.semester || ""}`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: groupKey,
          department: item.department,
          year: item.year,
          section: item.section,
          semester: item.semester,
          entries: [],
        };
      }
      const alreadyAdded = groups[groupKey].entries.some((existing) => existing.id === item.id);
      if (!alreadyAdded) {
        groups[groupKey].entries.push(item);
      }
      return groups;
    }, {});
  }, [timetables]);

  const sortedGroups = useMemo(() => {
    return Object.values(classGroups).sort((a, b) => {
      if (a.department !== b.department) return String(a.department).localeCompare(String(b.department));
      if (a.year !== b.year) return String(a.year).localeCompare(String(b.year));
      if (a.section !== b.section) return String(a.section).localeCompare(String(b.section));
      return String(a.semester).localeCompare(String(b.semester));
    });
  }, [classGroups]);

  const yearGroups = useMemo(() => {
    return Object.values(sortedGroups.reduce((acc, group) => {
      const key = `${group.department || ''}|${group.year || ''}|${group.semester || ''}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          department: group.department,
          year: group.year,
          semester: group.semester,
          classes: [],
        };
      }
      acc[key].classes.push(group);
      return acc;
    }, {}));
  }, [sortedGroups]);

  const selectedEntry = useMemo(() => {
    return timetables.find((item) => item.id === selectedEntryId) || null;
  }, [selectedEntryId, timetables]);

  const getTimeOrder = (time) => {
    const index = TIME_ORDER.indexOf(time);
    return index >= 0 ? index : TIME_ORDER.length + String(time).localeCompare("");
  };

  const buildTimesForGroup = (entries) => {
    const times = Array.from(new Set(entries.map((item) => item.time || item.period || ""))).filter(Boolean);
    return times.sort((a, b) => getTimeOrder(a) - getTimeOrder(b));
  };

  const approveEntry = async (id) => {
    setActionMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    const body = {
      approval_status: "approved",
    };

    if (editingId === id) {
      Object.assign(body, {
        faculty: editedRow.faculty,
        faculty_id: editedRow.faculty_id,
        hod_comment: commentById[id],
      });
    }

    try {
      await API.put(`api/students/hod/update-timetable/${id}/`, body, token);
      setActionMessage("Timetable approved.");
      setTimetables((prev) => prev.map((item) => item.id === id ? {
        ...item,
        is_approved: true,
        approval_status: 'approved',
        approved_by: 'You',
        hod_comment: commentById[id] || item.hod_comment,
        faculty: body.faculty || item.faculty,
        faculty_id: body.faculty_id || item.faculty_id,
      } : item));
      setEditingId(null);
      setEditedRow({});
    } catch (err) {
      setError(err?.message || "Unable to approve timetable entry.");
    }
  };

  const startEdit = (item) => {
    setSelectedEntryId(item.id);
    setEditingId(item.id);
    setEditedRow({
      faculty: item.faculty || "",
      faculty_id: item.faculty_id || "",
    });
    setCommentById((prev) => ({ ...prev, [item.id]: item.hod_comment || "" }));
    setActionMessage(null);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedRow({});
  };

  const handleEditedChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id) => {
    setActionMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      await API.put(`api/students/hod/update-timetable/${id}/`, {
        faculty: editedRow.faculty,
        faculty_id: editedRow.faculty_id,
        hod_comment: commentById[id],
        approval_status: 'under_review',
      }, token);
      setActionMessage("Faculty change suggested and timetable sent back to faculty.");
      setTimetables((prev) => prev.map((item) => item.id === id ? {
        ...item,
        faculty: editedRow.faculty,
        faculty_id: editedRow.faculty_id,
        approval_status: 'under_review',
        is_approved: false,
        hod_comment: commentById[id],
      } : item));
      setEditingId(null);
      setEditedRow({});
    } catch (err) {
      setError(err?.message || "Unable to save timetable changes.");
    }
  };

  const rejectEntry = async (id) => {
    setActionMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      await API.put(`api/students/hod/update-timetable/${id}/`, {
        approval_status: "rejected",
        hod_comment: commentById[id],
      }, token);
      setActionMessage("Timetable rejected and sent back to faculty.");
      setTimetables((prev) => prev.map((item) => item.id === id ? {
        ...item,
        approval_status: 'rejected',
        is_approved: false,
        hod_comment: commentById[id],
      } : item));
      setEditingId(null);
      setEditedRow({});
    } catch (err) {
      setError(err?.message || "Unable to reject timetable entry.");
    }
  };

  const requestRework = async (id) => {
    setActionMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    try {
      await API.put(`api/students/hod/update-timetable/${id}/`, {
        approval_status: "rework_assigned",
        hod_comment: commentById[id],
      }, token);
      setActionMessage("Rework requested from faculty.");
      setTimetables((prev) => prev.map((item) => item.id === id ? {
        ...item,
        approval_status: 'rework_assigned',
        is_approved: false,
        hod_comment: commentById[id],
      } : item));
      setEditingId(null);
      setEditedRow({});
    } catch (err) {
      setError(err?.message || "Unable to request rework for timetable entry.");
    }
  };

  const renderCell = (entry) => {
    if (!entry) {
      return <div style={cellEmpty}>No class</div>;
    }

    return (
      <div
        style={{
          ...cellContainer,
          border: selectedEntryId === entry.id ? '1px solid #1976d2' : '1px solid transparent',
        }}
      >
        <div style={cellHeader}>
          <span>{entry.subject || 'No Subject'}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1300px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1>HOD Classwise Timetable</h1>
          <p>Review class timetable grids and assign staff directly in each slot.</p>
        </div>
        <Link to="/hod/dashboard" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
          Back to dashboard
        </Link>
      </div>

      {loading && <p>Loading timetable data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {actionMessage && <p style={{ color: "green" }}>{actionMessage}</p>}

      {!loading && !error && timetables.length === 0 && (
        <div style={emptyCard}>
          No timetable entries are available for your department.
        </div>
      )}

      {!loading && !error && yearGroups.map((yearGroup) => (
        <div key={yearGroup.id} style={{ marginBottom: '34px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ margin: 0 }}>Year: {yearGroup.year || 'N/A'} — {yearGroup.department || 'N/A'}</h2>
            <p style={{ margin: '6px 0 0', color: '#555' }}>
              Semester: {yearGroup.semester || 'N/A'}
            </p>
          </div>

          {yearGroup.classes.map((group) => {
            const times = TIME_ORDER;
            const faculties = Array.from(new Set(group.entries.map((item) => item.faculty).filter(Boolean)));
            const subjectDetails = Object.values(group.entries.reduce((acc, entry) => {
              const key = entry.subject_code || entry.subject || `subject-${entry.id}`;
              if (!acc[key]) {
                acc[key] = {
                  subject_code: entry.subject_code || 'N/A',
                  abbreviation: getSubjectAbbreviation(entry),
                  subject_title: entry.subject || 'N/A',
                  credits: entry.credits != null ? entry.credits : '-',
                  periods_per_week: 0,
                  faculty: entry.faculty || 'Unassigned',
                  entry,
                };
              }
              acc[key].periods_per_week += 1;
              return acc;
            }, {}));

            const canManageSelected = selectedEntry && selectedEntry.department === group.department && selectedEntry.year === group.year && selectedEntry.section === group.section && selectedEntry.semester === group.semester;
            return (
              <section key={group.id} style={groupCard}>
                <div style={groupHeader}>
                  <div>
                    <h3 style={{ margin: 0 }}>Class: {group.department || 'N/A'}-{group.section || 'N/A'}</h3>
                    <p style={{ margin: '8px 0 0', color: '#555' }}>Year: {group.year || 'N/A'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', textAlign: 'right' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>Semester</p>
                      <p style={{ margin: '4px 0 0', color: '#555' }}>{group.semester || 'N/A'}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>Faculty</p>
                      <p style={{ margin: '4px 0 0', color: '#555' }}>{faculties.length ? faculties.join(', ') : 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Selected:</span>{' '}
                    {canManageSelected ? `${selectedEntry.subject || 'No subject selected'} (${selectedEntry.day || ''} ${selectedEntry.time || selectedEntry.period || ''})` : 'Select a class entry from the list below.'}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ ...buttonStyle, minWidth: '120px' }} onClick={() => approveEntry(selectedEntry?.id)} disabled={!canManageSelected}>
                      Approve
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: '#FFA000', minWidth: '120px' }} onClick={() => requestRework(selectedEntry?.id)} disabled={!canManageSelected}>
                      Rework
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: '#f44336', minWidth: '120px' }} onClick={() => rejectEntry(selectedEntry?.id)} disabled={!canManageSelected}>
                      Reject
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={matrixTable}>
                    <thead>
                      <tr>
                        <th style={matrixHeader}>Day</th>
                        {times.map((time, index) => (
                          <th key={time} style={matrixHeader}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: 700 }}> {index + 1} </span>
                              <span style={{ fontSize: '12px', color: '#555' }}>{time}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAY_ORDER.map((day) => (
                        <tr key={day}>
                          <td style={matrixCell}>{day}</td>
                          {times.map((time) => {
                            const entry = group.entries.find((item) => item.day === day && item.time === time);
                            return (
                              <td key={`${day}-${time}`} style={matrixCell}>
                                {renderCell(entry)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ overflowX: 'auto', marginTop: '18px' }}>
                  <table style={detailsTable}>
                    <thead>
                      <tr>
                        <th style={detailsHeader}>Subject Code</th>
                        <th style={detailsHeader}>Abbreviation</th>
                        <th style={detailsHeader}>Subject Title</th>
                        <th style={detailsHeader}>Credits</th>
                        <th style={detailsHeader}>Periods / Week</th>
                        <th style={detailsHeader}>Faculty in Charge</th>
                        <th style={detailsHeader}>Suggestion</th>
                        <th style={detailsHeader}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectDetails.map((detail) => {
                        const isRowEditing = editingId === detail.entry.id;
                        return (
                          <tr key={`${detail.subject_code}-${detail.subject_title}`}>
                            <td style={detailsCell}>{detail.subject_code}</td>
                            <td style={detailsCell}>{detail.abbreviation}</td>
                            <td style={detailsCell}>{detail.subject_title}</td>
                            <td style={detailsCell}>{detail.credits}</td>
                            <td style={detailsCell}>{detail.periods_per_week}</td>
                            <td style={detailsCell}>
                              {isRowEditing ? (
                                <select
                                  value={editedRow.faculty_id || ''}
                                  onChange={(e) => {
                                    const selected = facultyOptions.find((faculty) => String(faculty.id) === String(e.target.value));
                                    handleEditedChange('faculty_id', e.target.value);
                                    handleEditedChange('faculty', selected ? selected.full_name || selected.username : '');
                                  }}
                                  style={selectStyle}
                                >
                                  <option value="">Select Faculty</option>
                                  {facultyOptions.map((faculty) => {
                                    const label = `${faculty.full_name || faculty.username}${faculty.designation ? ` — ${faculty.designation}` : ''}`;
                                    return (
                                      <option key={faculty.id} value={faculty.id}>
                                        {label}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                detail.faculty || 'Unassigned'
                              )}
                            </td>
                            <td style={detailsCell}>
                              {isRowEditing ? (
                                <textarea
                                  rows={2}
                                  value={commentById[detail.entry.id] || ''}
                                  onChange={(e) => setCommentById((prev) => ({ ...prev, [detail.entry.id]: e.target.value }))}
                                  placeholder="Add suggestion"
                                  style={{ ...textareaStyle, minHeight: '60px', margin: 0 }}
                                />
                              ) : (
                                commentById[detail.entry.id] || detail.entry.hod_comment || 'No suggestion'
                              )}
                            </td>
                            <td style={detailsCell}>
                              {isRowEditing ? (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <button style={buttonStyle} onClick={() => saveEdit(detail.entry.id)}>
                                    Save
                                  </button>
                                  <button style={{ ...buttonStyle, backgroundColor: '#777' }} onClick={cancelEdit}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button style={buttonStyle} onClick={() => startEdit(detail.entry)}>
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const groupCard = {
  padding: '22px',
  marginBottom: '22px',
  borderRadius: '18px',
  backgroundColor: '#fff',
  border: '1px solid #e6ecf3',
  boxShadow: '0 13px 28px rgba(15, 23, 42, 0.05)',
};

const groupHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
  gap: '16px',
};

const statBadge = {
  padding: '8px 12px',
  backgroundColor: '#f4f7fb',
  borderRadius: '999px',
  color: '#2c3e50',
  fontSize: '13px',
  fontWeight: 600,
};

const matrixTable = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '900px',
};

const matrixHeader = {
  textAlign: 'left',
  padding: '14px',
  borderBottom: '2px solid #e2e8f0',
  backgroundColor: '#f9fafb',
  color: '#1f2937',
  fontSize: '14px',
};

const matrixCell = {
  verticalAlign: 'middle',
  padding: '8px 10px',
  borderBottom: '1px solid #e5e7eb',
  borderRight: '1px solid #e5e7eb',
  minWidth: '180px',
  height: '60px',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '850px',
};

const detailsHeader = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '2px solid #d1d5db',
  backgroundColor: '#f8fafc',
  color: '#111827',
  fontSize: '13px',
};

const detailsCell = {
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
  color: '#374151',
  fontSize: '13px',
};

const cellContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '4px',
  padding: '6px 8px',
  backgroundColor: '#fefefe',
  borderRadius: '10px',
  minHeight: '48px',
  maxHeight: '60px',
};

const cellHeader = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const cellInfo = {
  color: '#4b5563',
  fontSize: '13px',
  lineHeight: 1.4,
};

const cellEmpty = {
  color: '#6b7280',
  fontSize: '12px',
  fontStyle: 'italic',
};

const buttonStyle = {
  padding: '8px 14px',
  border: 'none',
  backgroundColor: '#1976d2',
  color: 'white',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '13px',
};

const selectStyle = {
  width: '100%',
  padding: '9px 10px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  minHeight: '72px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
};

const emptyCard = {
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
  color: '#555',
};
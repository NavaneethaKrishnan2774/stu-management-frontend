import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialRooms = [
  { id: 101, roomNumber: "101", totalBeds: 4, students: [] },
  { id: 102, roomNumber: "102", totalBeds: 4, students: [] },
  { id: 103, roomNumber: "103", totalBeds: 4, students: [] },
  { id: 104, roomNumber: "104", totalBeds: 4, students: [] },
  { id: 105, roomNumber: "105", totalBeds: 4, students: [] },
];

const initialStudents = [
  {
    id: 1,
    name: "Aarav Mehta",
    department: "CSE",
    klass: "2nd Year",
    section: "A",
    year: "2",
    joinDate: "2024-06-01",
    daysStayed: 340,
    parentContact: "9876543210",
    facultyName: "Dr. Rajesh",
    facultyContact: "9988776655",
    feeStatus: "Paid",
    lastEntry: "2025-05-09",
    leavesTaken: 5,
    lateEntries: 2,
    relievingDate: "2026-05-30",
  },
  {
    id: 2,
    name: "Ishita Verma",
    department: "CSE",
    klass: "2nd Year",
    section: "A",
    year: "2",
    joinDate: "2024-06-01",
    daysStayed: 340,
    parentContact: "9876543211",
    facultyName: "Dr. Rajesh",
    facultyContact: "9988776655",
    feeStatus: "Pending",
    lastEntry: "2025-05-08",
    leavesTaken: 8,
    lateEntries: 3,
    relievingDate: "2026-05-30",
  },
  {
    id: 3,
    name: "Rohan Sharma",
    department: "ECE",
    klass: "2nd Year",
    section: "B",
    year: "2",
    joinDate: "2024-07-15",
    daysStayed: 325,
    parentContact: "9876543212",
    facultyName: "Prof. Priya",
    facultyContact: "9988776654",
    feeStatus: "Paid",
    lastEntry: "2025-05-10",
    leavesTaken: 2,
    lateEntries: 0,
    relievingDate: "2026-06-15",
  },
  {
    id: 4,
    name: "Neha Gupta",
    department: "MECH",
    klass: "3rd Year",
    section: "C",
    year: "3",
    joinDate: "2023-08-20",
    daysStayed: 620,
    parentContact: "9876543213",
    facultyName: "Dr. Suresh",
    facultyContact: "9988776653",
    feeStatus: "Paid",
    lastEntry: "2025-05-09",
    leavesTaken: 12,
    lateEntries: 5,
    relievingDate: "2025-06-10",
  },
  {
    id: 5,
    name: "Vikram Singh",
    department: "CSE",
    klass: "1st Year",
    section: "A",
    year: "1",
    joinDate: "2025-03-01",
    daysStayed: 70,
    parentContact: "9876543214",
    facultyName: "Dr. Rajesh",
    facultyContact: "9988776655",
    feeStatus: "Pending",
    lastEntry: "2025-05-07",
    leavesTaken: 1,
    lateEntries: 1,
    relievingDate: "2027-05-30",
  },
  {
    id: 6,
    name: "Priya K",
    department: "AIDS",
    klass: "2nd Year",
    section: "A",
    year: "2",
    joinDate: "2024-08-10",
    daysStayed: 300,
    parentContact: "9876543215",
    facultyName: "Prof. Meera",
    facultyContact: "9988776652",
    feeStatus: "Paid",
    lastEntry: "2025-05-10",
    leavesTaken: 3,
    lateEntries: 1,
    relievingDate: "2026-05-30",
  },
];

const initialComplaints = [
  { id: 1, roomId: 101, studentName: "Aarav Mehta", complaint: "AC not working properly", date: "2025-05-08", status: "Pending" },
  { id: 2, roomId: 103, studentName: "Rohan Sharma", complaint: "Water leakage in bathroom", date: "2025-05-09", status: "In Progress" },
  { id: 3, roomId: 102, studentName: "Ishita Verma", complaint: "Fan making noise", date: "2025-05-07", status: "Resolved" },
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const todayKey = () => new Date().toISOString().split("T")[0];

const isTodayKey = (dateKey) => dateKey === todayKey();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
};

export default function HostelWardenDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [rooms, setRooms] = useState(initialRooms);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [studentFilter, setStudentFilter] = useState("all");
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [newStudent, setNewStudent] = useState({ name: "", department: "CSE", klass: "1st Year", section: "A", year: "1", parentContact: "", facultyName: "", facultyContact: "", feeStatus: "Paid", relievingDate: "" });
  const [newComplaint, setNewComplaint] = useState({ roomId: 101, studentName: "", complaint: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const designation = localStorage.getItem("designation");
    if (!token || designation !== "hostel_warden") {
      navigate("/staff/login?designation=hostel_warden");
      return;
    }
    if (rooms.every((room) => room.students.length === 0)) {
      const assignedRooms = [...rooms];
      const copied = [...students];
      copied.forEach((student, idx) => {
        const roomIndex = Math.floor(idx / 4) % assignedRooms.length;
        if (assignedRooms[roomIndex].students.length < assignedRooms[roomIndex].totalBeds) {
          assignedRooms[roomIndex].students.push({ ...student, bedNumber: assignedRooms[roomIndex].students.length + 1 });
        }
      });
      setRooms(assignedRooms);
    }
    const today = todayKey();
    setAttendanceRecords((prev) => ({
      ...prev,
      [today]: prev[today] || Object.fromEntries(students.map((s) => [s.id, "Present"])),
    }));
  }, [navigate, rooms, students]);

  const studentCount = students.length;
  const vacantRoomsCount = rooms.filter((room) => room.students.length < room.totalBeds).length;
  const unresolvedComplaints = complaints.filter((c) => c.status !== "Resolved").length;
  const presentToday = attendanceRecords[todayKey()] ? Object.values(attendanceRecords[todayKey()]).filter((status) => status === "Present").length : 0;

  const filteredStudents = useMemo(() => {
    const today = new Date();
    const thirtyDays = new Date(today);
    thirtyDays.setDate(today.getDate() + 30);
    return [...students]
      .filter((student) => {
        if (studentFilter === "feePending") return student.feeStatus === "Pending";
        if (studentFilter === "feePaid") return student.feeStatus === "Paid";
        if (studentFilter === "recent") return new Date(student.joinDate) >= new Date(today.setDate(today.getDate() - 30));
        if (studentFilter === "relieving") return new Date(student.relievingDate) <= thirtyDays;
        if (studentFilter === "lateEntries") return student.lateEntries >= 3;
        if (studentFilter === "maxLeaves") return student.leavesTaken >= 10;
        return true;
      })
      .sort((a, b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name));
  }, [studentFilter, students]);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  const updateAttendance = (studentId, dateKey, status) => {
    if (!isTodayKey(dateKey)) return;
    setAttendanceRecords((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [studentId]: status,
      },
    }));
  };

  const toggleRoomView = (roomId) => {
    setSelectedRoomId(roomId);
    setView("rooms");
  };

  const assignStudentToBed = (roomId, bedNumber, studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    setRooms((prev) => prev.map((room) => {
      if (room.id !== roomId) return room;
      if (room.students.some((s) => s.bedNumber === bedNumber)) return room;
      return { ...room, students: [...room.students, { ...student, bedNumber }] };
    }));
  };

  const removeStudentFromBed = (roomId, bedNumber) => {
    setRooms((prev) => prev.map((room) => {
      if (room.id !== roomId) return room;
      return { ...room, students: room.students.filter((student) => student.bedNumber !== bedNumber) };
    }));
  };

  const addNewStudent = () => {
    if (!newStudent.name.trim()) return;
    const id = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const student = {
      id,
      ...newStudent,
      daysStayed: 0,
      joinDate: todayKey(),
      lastEntry: todayKey(),
      leavesTaken: 0,
      lateEntries: 0,
    };
    setStudents((prev) => [...prev, student]);
    setNewStudent({ name: "", department: "CSE", klass: "1st Year", section: "A", year: "1", parentContact: "", facultyName: "", facultyContact: "", feeStatus: "Paid", relievingDate: todayKey() });
    setStudentFilter("all");
  };

  const addComplaint = () => {
    if (!newComplaint.studentName.trim() || !newComplaint.complaint.trim()) return;
    setComplaints((prev) => [...prev, { id: prev.length + 1, status: "Pending", date: todayKey(), ...newComplaint }]);
    setNewComplaint({ roomId: 101, studentName: "", complaint: "" });
  };

  const updateComplaintStatus = (id) => {
    setComplaints((prev) => prev.map((complaint) => {
      if (complaint.id !== id) return complaint;
      const next = complaint.status === "Pending" ? "In Progress" : complaint.status === "In Progress" ? "Resolved" : "Resolved";
      return { ...complaint, status: next };
    }));
  };

  const roomStudents = selectedRoom ? selectedRoom.students.slice().sort((a, b) => a.bedNumber - b.bedNumber) : [];
  const availableBeds = selectedRoom ? [...Array(selectedRoom.totalBeds).keys()].map((idx) => idx + 1).filter((bed) => !selectedRoom.students.some((student) => student.bedNumber === bed)) : [];
  const unassignedStudents = students.filter((student) => !rooms.some((room) => room.students.some((assigned) => assigned.id === student.id)));

  const daysThisMonth = getDaysInMonth(new Date().getFullYear(), new Date().getMonth());
  const monthDays = [...Array(daysThisMonth).keys()].map((idx) => idx + 1);

  const attendanceSummary = useMemo(() => {
    const summary = {};
    students.forEach((student) => {
      if (!summary[student.department]) summary[student.department] = { present: 0, absent: 0, halfday: 0 };
      const dayKeys = Object.keys(attendanceRecords);
      dayKeys.forEach((dateKey) => {
        const status = attendanceRecords[dateKey]?.[student.id] || "Absent";
        summary[student.department][status === "Present" ? "present" : status === "HalfDay" ? "halfday" : "absent"] += 1;
      });
    });
    return summary;
  }, [attendanceRecords, students]);

  const renderDashboard = () => (
    <>
      <div className="tile-row">
        <div className="tile" onClick={() => setView("students")}> 
          <div className="emoji">👨‍🎓</div>
          <h3>Total Students</h3>
          <p>View residents grouped by department and name.</p>
          <div className="count">{studentCount}</div>
        </div>
        <div className="tile" onClick={() => setView("rooms")}> 
          <div className="emoji">🚪</div>
          <h3>Total Rooms Availability</h3>
          <p>See vacant beds and room occupancy.</p>
          <div className="count">{vacantRoomsCount} vacant</div>
        </div>
        <div className="tile" onClick={() => setView("attendance")}> 
          <div className="emoji">📋</div>
          <h3>Present / Absent</h3>
          <p>Mark attendance with today's controls.</p>
          <div className="count">{presentToday} present</div>
        </div>
        <div className="tile" onClick={() => setView("complaints")}> 
          <div className="emoji">📢</div>
          <h3>Complaints Overview</h3>
          <p>Manage student room complaints.</p>
          <div className="count">{unresolvedComplaints}</div>
        </div>
      </div>
    </>
  );

  const renderStudentsPage = () => (
    <div className="page-container">
      <div className="breadcrumb">
        <button className="back-link" onClick={() => setView("dashboard")}>← Dashboard</button>
        <h2>Total Students</h2>
      </div>
      <div className="filter-bar">
        <div className="filter-group">
          <label>Filter</label>
          <select className="filter-select" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
            <option value="all">All Students</option>
            <option value="feePending">Fee Pending</option>
            <option value="feePaid">Fee Paid</option>
            <option value="recent">Recently Added</option>
            <option value="relieving">Relieving Soon</option>
            <option value="lateEntries">Late Entries</option>
            <option value="maxLeaves">Max Leaves</option>
          </select>
        </div>
        <button className="action-btn btn-primary" onClick={() => setView("addStudent")}>+ Add New Student</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Class</th>
              <th>Section</th>
              <th>Year</th>
              <th>Days Stayed</th>
              <th>Parent Contact</th>
              <th>Faculty</th>
              <th>Faculty Contact</th>
              <th>Fee Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={student.id}>
                <td>{idx + 1}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.klass}</td>
                <td>{student.section}</td>
                <td>{student.year}</td>
                <td>{student.daysStayed}</td>
                <td>{student.parentContact}</td>
                <td>{student.facultyName}</td>
                <td>{student.facultyContact}</td>
                <td style={{ color: student.feeStatus === "Paid" ? "#15803d" : "#b91c1c" }}>{student.feeStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoomsPage = () => (
    <div className="page-container">
      <div className="breadcrumb">
        <button className="back-link" onClick={() => setView("dashboard")}>← Dashboard</button>
        <h2>Rooms Availability</h2>
      </div>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card" onClick={() => toggleRoomView(room.id)}>
            <div className="door-emoji">🚪</div>
            <div className="room-number">Room {room.roomNumber}</div>
            <div>{room.students.length}/{room.totalBeds} beds occupied</div>
          </div>
        ))}
      </div>
      {selectedRoom && (
        <div className="page-container" style={{ marginTop: "24px" }}>
          <div className="breadcrumb">
            <button className="back-link" onClick={() => setSelectedRoomId(null)}>← Back to Rooms</button>
            <h2>Room {selectedRoom.roomNumber} Details</h2>
          </div>
          <div className="bed-layout">
            {[...Array(selectedRoom.totalBeds).keys()].map((index) => {
              const bedNumber = index + 1;
              const bedStudent = selectedRoom.students.find((student) => student.bedNumber === bedNumber);
              return (
                <div key={bedNumber} className={`bed ${bedStudent ? "occupied" : "vacant"}`} onClick={() => setSelectedBed(bedNumber)}>
                  <div className="bed-icon">{bedStudent ? "🛏️👤" : "🛏️"}</div>
                  <div className="student-name">Bed {bedNumber}</div>
                  <div style={{ fontSize: "0.78rem", marginTop: "6px" }}>{bedStudent ? bedStudent.name : "Vacant"}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "20px" }}>
            {selectedBed && (
              <div className="page-container">
                <h3>Bed {selectedBed} Actions</h3>
                {selectedRoom.students.find((student) => student.bedNumber === selectedBed) ? (
                  <div>
                    <button className="action-btn btn-danger" onClick={() => removeStudentFromBed(selectedRoom.id, selectedBed)}>Remove Student</button>
                    <button className="action-btn btn-warning" onClick={() => setView("shiftBed")}>Shift Student</button>
                  </div>
                ) : (
                  <div>
                    <label>Select Student</label>
                    <select id="assign-student" style={{ padding: "10px", borderRadius: "12px", border: "1px solid #cbd5e1", width: "100%", marginTop: "10px" }}>
                      <option value="">Select student</option>
                      {unassignedStudents.map((student) => (
                        <option key={student.id} value={student.id}>{student.name} ({student.department})</option>
                      ))}
                    </select>
                    <button className="action-btn btn-primary" style={{ marginTop: "12px" }} onClick={() => {
                      const select = document.getElementById("assign-student");
                      const studentId = Number(select.value);
                      if (studentId) assignStudentToBed(selectedRoom.id, selectedBed, studentId);
                    }}>
                      Assign Student
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderAttendancePage = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const dayHeaders = [...Array(daysInMonth).keys()].map((index) => index + 1);

    const spectators = filteredStudents;

    return (
      <div className="page-container">
        <div className="breadcrumb">
          <button className="back-link" onClick={() => setView("dashboard")}>← Dashboard</button>
          <h2>Attendance</h2>
        </div>
        <div className="dept-stats">
          {Object.entries(attendanceSummary).map(([department, totals]) => (
            <div key={department} className="dept-stat-card">
              <h4>{department}</h4>
              <div className="dept-stats-numbers">
                <span className="present-badge">✓ {totals.present}</span>
                <span className="halfday-badge">◐ {totals.halfday}</span>
                <span className="absent-badge">✗ {totals.absent}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Room</th>
                <th>Name</th>
                <th>Department</th>
                {dayHeaders.map((day) => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {rooms.flatMap((room) => room.students.map((student, idx) => (
                <tr key={`${room.id}-${student.id}`}>
                  <td>{idx + 1}</td>
                  <td>{room.roomNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  {dayHeaders.map((day) => {
                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const status = attendanceRecords[dateKey]?.[student.id] || "Absent";
                    const isEditable = isTodayKey(dateKey);
                    const symbol = status === "Present" ? "✓" : status === "HalfDay" ? "◐" : "✗";
                    return (
                      <td key={day}>
                        {isEditable ? (
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            <button className="attendance-btn present" onClick={() => updateAttendance(student.id, dateKey, "Present")}>✓</button>
                            <button className="attendance-btn absent" onClick={() => updateAttendance(student.id, dateKey, "Absent")}>✗</button>
                            <button className="attendance-btn halfday" onClick={() => updateAttendance(student.id, dateKey, "HalfDay")}>◐</button>
                          </div>
                        ) : (
                          <span className={status === "Present" ? "present-badge" : status === "HalfDay" ? "halfday-badge" : "absent-badge"}>{symbol}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderComplaintsPage = () => (
    <div className="page-container">
      <div className="breadcrumb">
        <button className="back-link" onClick={() => setView("dashboard")}>← Dashboard</button>
        <h2>Complaints Overview</h2>
      </div>
      <button className="action-btn btn-primary" onClick={() => setView("addComplaint")}>+ Add Complaint</button>
      <div style={{ marginTop: "24px" }}>
        {rooms.map((room) => {
          const roomComplaints = complaints.filter((complaint) => complaint.roomId === room.id);
          if (!roomComplaints.length) return null;
          return (
            <div key={room.id} style={{ marginBottom: "24px" }}>
              <h3>Room {room.roomNumber}</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Student</th>
                    <th>Complaint</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roomComplaints.map((complaint, index) => (
                    <tr key={complaint.id}>
                      <td>{index + 1}</td>
                      <td>{complaint.studentName}</td>
                      <td>{complaint.complaint}</td>
                      <td>{formatDate(complaint.date)}</td>
                      <td>{complaint.status}</td>
                      <td><button className="action-btn btn-warning" onClick={() => updateComplaintStatus(complaint.id)}>Next Status</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAddStudentPage = () => (
    <div className="page-container">
      <div className="breadcrumb">
        <button className="back-link" onClick={() => setView("students")}>← Back to Students</button>
        <h2>Add New Student</h2>
      </div>
      <div className="form-grid">
        {[
          { label: "Full Name", name: "name" },
          { label: "Department", name: "department", type: "select", options: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "AIDS"] },
          { label: "Class", name: "klass" },
          { label: "Section", name: "section" },
          { label: "Year", name: "year", type: "select", options: ["1", "2", "3", "4"] },
          { label: "Parent Contact", name: "parentContact" },
          { label: "Faculty Name", name: "facultyName" },
          { label: "Faculty Contact", name: "facultyContact" },
          { label: "Fee Status", name: "feeStatus", type: "select", options: ["Paid", "Pending"] },
          { label: "Relieving Date", name: "relievingDate", type: "date" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "select" ? (
              <select value={newStudent[field.name]} onChange={(e) => setNewStudent((prev) => ({ ...prev, [field.name]: e.target.value }))}>
                {field.options.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                value={newStudent[field.name]}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <button className="action-btn btn-primary" onClick={addNewStudent}>Save Student</button>
    </div>
  );

  const renderAddComplaintPage = () => (
    <div className="page-container">
      <div className="breadcrumb">
        <button className="back-link" onClick={() => setView("complaints")}>← Back to Complaints</button>
        <h2>Add Complaint</h2>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Room</label>
          <select value={newComplaint.roomId} onChange={(e) => setNewComplaint((prev) => ({ ...prev, roomId: Number(e.target.value) }))}>
            {rooms.map((room) => (<option key={room.id} value={room.id}>Room {room.roomNumber}</option>))}
          </select>
        </div>
        <div className="form-group">
          <label>Student Name</label>
          <input value={newComplaint.studentName} onChange={(e) => setNewComplaint((prev) => ({ ...prev, studentName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Complaint</label>
          <textarea rows={4} value={newComplaint.complaint} onChange={(e) => setNewComplaint((prev) => ({ ...prev, complaint: e.target.value }))} />
        </div>
      </div>
      <button className="action-btn btn-primary" onClick={addComplaint}>Submit Complaint</button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #f0f4f9; }
        .dashboard-container { max-width: 1400px; margin: 0 auto; padding: 28px 24px; }
        .header { margin-bottom: 30px; }
        .header h1 { font-size: 2rem; color: #0a2b3e; display: flex; align-items: center; gap: 12px; }
        .header h1:before { content: '🏠'; font-size: 2rem; }
        .tile-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .tile { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; border-radius: 28px; padding: 28px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; text-align: center; }
        .tile:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
        .emoji { font-size: 3rem; margin-bottom: 12px; }
        .tile h3 { font-size: 1.3rem; margin-bottom: 8px; }
        .tile p { font-size: 0.85rem; opacity: 0.85; }
        .count { font-size: 2rem; font-weight: 800; margin-top: 10px; }
        .page-container { background: white; border-radius: 28px; padding: 24px; margin-top: 10px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); }
        .breadcrumb { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .back-link { background: #64748b; color: white; padding: 8px 18px; border-radius: 40px; cursor: pointer; border: none; }
        .filter-bar { background: white; border-radius: 60px; padding: 12px 24px; margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06); }
        .filter-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .filter-group label { font-weight: 600; font-size: 0.85rem; }
        .filter-select { padding: 10px 14px; border-radius: 30px; border: 1px solid #cbd5e1; }
        .action-btn { padding: 10px 18px; border-radius: 40px; border: none; cursor: pointer; font-weight: 600; margin: 4px; }
        .btn-primary { background: #2b7e3a; color: white; }
        .btn-danger { background: #dc2626; color: white; }
        .btn-warning { background: #f59e0b; color: white; }
        .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 20px; overflow: hidden; margin-top: 15px; }
        .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }
        .data-table th { background: #f1f5f9; font-weight: 600; }
        .rooms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin: 20px 0; }
        .room-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 18px; text-align: center; cursor: pointer; transition: 0.2s; }
        .room-card:hover { border-color: #2b7e3a; transform: scale(1.02); }
        .room-number { font-weight: 700; margin-top: 8px; }
        .bed-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
        .bed { background: #f1f5f9; border-radius: 16px; padding: 14px; text-align: center; cursor: pointer; transition: 0.2s; border: 2px solid #e2e8f0; }
        .bed:hover { transform: translateY(-2px); }
        .bed.occupied { background: #fee2e2; border-color: #ef4444; }
        .bed.vacant { background: #d1fae5; border-color: #22c55e; }
        .bed-icon { font-size: 1.6rem; }
        .student-name { font-weight: 600; font-size: 0.9rem; margin-top: 8px; }
        .attendance-table { width: 100%; overflow-x: auto; }
        .attendance-table table { width: 100%; border-collapse: collapse; min-width: 900px; }
        .attendance-table th, .attendance-table td { border: 1px solid #e2e8f0; padding: 10px 8px; text-align: center; font-size: 0.78rem; }
        .attendance-table th { background: #f1f5f9; position: sticky; top: 0; z-index: 2; }
        .attendance-btn { width: 34px; height: 34px; border-radius: 10px; border: none; cursor: pointer; font-size: 1rem; margin: 2px; }
        .attendance-btn.present { background: #22c55e; color: white; }
        .attendance-btn.absent { background: #ef4444; color: white; }
        .attendance-btn.halfday { background: #facc15; color: #0f172a; }
        .present-badge { background: #22c55e20; color: #15803d; padding: 6px 10px; border-radius: 20px; display: inline-block; font-weight: 600; }
        .absent-badge { background: #fee2e8; color: #b91c1c; padding: 6px 10px; border-radius: 20px; display: inline-block; font-weight: 600; }
        .halfday-badge { background: #fef6c2; color: #92400e; padding: 6px 10px; border-radius: 20px; display: inline-block; font-weight: 600; }
        .dept-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .dept-stat-card { background: white; border-radius: 20px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); text-align: center; }
        .dept-stat-card h4 { color: #1f4f2d; margin-bottom: 10px; }
        .dept-stats-numbers { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 8px; color: #334155; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #e2edf2; font-size: 0.95rem; }
      `}</style>
      <div className="header">
        <h1>Warden Module | Hostel Management System</h1>
      </div>
      {view === "dashboard" && renderDashboard()}
      {view === "students" && renderStudentsPage()}
      {view === "rooms" && renderRoomsPage()}
      {view === "attendance" && renderAttendancePage()}
      {view === "complaints" && renderComplaintsPage()}
      {view === "addStudent" && renderAddStudentPage()}
      {view === "addComplaint" && renderAddComplaintPage()}
    </div>
  );
}

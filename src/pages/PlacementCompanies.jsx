import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

const initialCompanies = [
  {
    id: 1,
    name: "Microsoft India",
    type: "IT",
    batch: "2025",
    rating: 4.8,
    departments: ["CSE", "IT", "ECE", "AIDS"],
    location: "Hyderabad",
    conductedDate: "2025-03-10",
    venue: "Main Auditorium, Campus",
    package: "18.5 LPA",
    highestPackage: "18.5 LPA",
    avgPackage: "18.2 LPA",
    designation: "Software Engineer",
    hrName: "Priya Sharma",
    hrEmail: "priya.s@microsoft.com",
    hrPhone: "9876543210",
    description: "Global tech leader for software development and cloud solutions.",
    placedStudents: [
      { name: "Aarav Mehta", roll: "CS2101", dept: "CSE", batch: "2025", cgpa: 9.2, package: "18.5 LPA", role: "SDE" },
      { name: "Ishita Verma", roll: "CS2105", dept: "CSE", batch: "2025", cgpa: 9.0, package: "18 LPA", role: "SDE" },
      { name: "Rohan Sharma", roll: "EC2108", dept: "ECE", batch: "2025", cgpa: 8.8, package: "18 LPA", role: "Software Engineer" },
    ],
    rounds: [
      { name: "Online Aptitude", cleared: 85, total: 210 },
      { name: "Technical Interview", cleared: 42, total: 85 },
      { name: "HR + Managerial", cleared: 3, total: 42 },
    ],
  },
  {
    id: 2,
    name: "Tesla Motors",
    type: "Core",
    batch: "2024",
    rating: 4.5,
    departments: ["MECH", "EEE", "ECE", "CIVIL"],
    location: "Bangalore",
    conductedDate: "2024-11-20",
    venue: "Engineering Block, Seminar Hall",
    package: "22 LPA",
    highestPackage: "22 LPA",
    avgPackage: "21.5 LPA",
    designation: "Electrical Engineer",
    hrName: "Vikram Raj",
    hrEmail: "vikram@tesla.com",
    hrPhone: "9988776655",
    description: "Electric vehicles, energy innovation, and automation.",
    placedStudents: [
      { name: "Neha Gupta", roll: "ME3102", dept: "MECH", batch: "2024", cgpa: 8.9, package: "22 LPA", role: "Electrical Engineer" },
      { name: "Aditya Kumar", roll: "EE405", dept: "EEE", batch: "2024", cgpa: 8.7, package: "21 LPA", role: "Controls Engineer" },
    ],
    rounds: [
      { name: "Aptitude + Technical", cleared: 56, total: 150 },
      { name: "Design & Interview", cleared: 18, total: 56 },
      { name: "HR Round", cleared: 2, total: 18 },
    ],
  },
  {
    id: 3,
    name: "Google India",
    type: "IT",
    batch: "2026",
    rating: 4.9,
    departments: ["CSE", "IT", "AIDS"],
    location: "Bangalore",
    conductedDate: "2025-04-15",
    venue: "Virtual (Online)",
    package: "32 LPA",
    highestPackage: "35 LPA",
    avgPackage: "33 LPA",
    designation: "Software Engineer",
    hrName: "Anjali Verma",
    hrEmail: "anjali@google.com",
    hrPhone: "9876500003",
    description: "Search engine, cloud computing, and AI solutions.",
    placedStudents: [
      { name: "Vikram Singh", roll: "CS2180", dept: "CSE", batch: "2026", cgpa: 9.6, package: "35 LPA", role: "SDE" },
      { name: "Priya K", roll: "AI2122", dept: "AIDS", batch: "2026", cgpa: 9.4, package: "32 LPA", role: "Software Engineer" },
    ],
    rounds: [
      { name: "Coding Round", cleared: 120, total: 350 },
      { name: "Technical Interview", cleared: 28, total: 120 },
      { name: "Googleyness Round", cleared: 2, total: 28 },
    ],
  },
  {
    id: 4,
    name: "Amazon",
    type: "IT",
    batch: "2025",
    rating: 4.6,
    departments: ["CSE", "IT", "ECE"],
    location: "Chennai",
    conductedDate: "2025-02-18",
    venue: "Virtual (Online)",
    package: "26 LPA",
    highestPackage: "28 LPA",
    avgPackage: "27 LPA",
    designation: "SDE-1",
    hrName: "Rahul Nair",
    hrEmail: "rahul@amazon.com",
    hrPhone: "9123456780",
    description: "E-commerce, cloud computing, and AI-driven solutions.",
    placedStudents: [
      { name: "Sanya Kapoor", roll: "CS2120", dept: "CSE", batch: "2025", cgpa: 9.4, package: "28 LPA", role: "SDE-1" },
      { name: "Kunal Sharma", roll: "IT2103", dept: "IT", batch: "2025", cgpa: 8.9, package: "26 LPA", role: "SDE" },
    ],
    rounds: [
      { name: "Online Assessment", cleared: 94, total: 270 },
      { name: "Technical Round", cleared: 28, total: 94 },
      { name: "Bar Raiser + HR", cleared: 2, total: 28 },
    ],
  },
];

const batchStudentCounts = { "2024": 450, "2025": 520, "2026": 380 };

const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);
  return [
    ...Array(fullStars).fill("★"),
    ...(half ? ["½"] : []),
    ...Array(emptyStars).fill("☆"),
  ];
};

const getDriveStatus = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "ongoing";
  if (d < today) return "completed";
  return "upcoming";
};

const generateEmailMessage = (company) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const currentTime = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `Date: ${currentDate}\nTime: ${currentTime}\n\nTo,\nThe Hiring Team\n${company.name}\n\nDear Sir/Madam,\n\nGreetings from SRM Institute of Technology, Chennai.\n\nWe hope this message finds you well. It is our pleasure to formally connect with ${company.name} to explore opportunities for campus recruitment collaboration for the academic year 2025-2026.\n\nSRM Institute of Technology has been consistently committed to academic excellence and industry-oriented skill development. Our students are trained not only in core technical domains but also in problem-solving, communication, and real-world project implementation to meet evolving industry expectations.\n\n### 📊 Student Strength & Academic Profile\n\n* Total number of students (Final Year): 1240\n* Departments and student distribution:\n  * CSE – 245 students (Skills: Python, Java, DSA, Web Dev)\n  * ECE – 210 students (Skills: VLSI, Embedded, IoT)\n  * MECH – 190 students (Skills: CAD, Thermodynamics, Robotics)\n  * CIVIL – 140 students (Skills: AutoCAD, Structural Design)\n  * EEE – 175 students (Skills: Power Systems, Control Systems)\n  * IT – 160 students (Skills: Cloud, Networking, DBMS)\n  * AIDS – 120 students (Skills: ML, AI, Data Science)\n\n### 🧠 Skill Highlights\n\nOur students possess competencies in:\n\n* Programming: Python, Java, JavaScript, C++\n* Web Development: HTML, CSS, React, Node.js, Angular\n* Core Subjects: Data Structures, DBMS, Operating Systems, Computer Networks\n* Project Work: Real-time systems including transport management, AI-based solutions, healthcare platforms, and full-stack applications\n* Internship Exposure: 860 students have completed internships in relevant domains\n\n### 🏫 About the Institution\n\nSRM Institute of Technology, located in Chennai, Tamil Nadu, provides:\n\n* Modern infrastructure and smart classrooms with high-tech labs\n* Dedicated placement training programs with industry experts\n* Strong academic track record with consistent university ranks\n* Continuous industry interaction, hackathons, and workshops\n\nWe would be honored to collaborate with ${company.name} for recruitment opportunities and are confident that our students can contribute effectively to your organization.\n\nWe request you to kindly consider our institution for your campus hiring initiatives. We are flexible and ready to align with your recruitment process, timelines, and requirements.\n\nPlease feel free to reach out for any additional information or clarification.\n\nLooking forward to a positive response and a long-term association.\n\nWarm regards,\n\nDr. S. Rajesh Kumar\nPlacement Officer\nSRM Institute of Technology\nLocation: Chennai, Tamil Nadu\nContact Number: +91 98765 43210\nEmail: placement@srm.edu.in`;
};

const getCompanyDetailsPage = (company) => {
  const studentsRows = company.placedStudents
    .map(
      (s) => `<tr><td style="display:flex;align-items:center;gap:10px;"><div style="width:40px;height:40px;border-radius:50%;background:${getAvatarColor(s.name)};display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${getInitials(s.name)}</div>${s.name}</td><td>${s.roll}</td><td>${s.dept}</td><td>${s.batch}</td><td>${s.cgpa}</td><td style="font-weight:600;color:#2b7e3a;">${s.package}</td><td>${s.role}</td></tr>`
    )
    .join("");
  const roundsHtml = company.rounds
    .map(
      (r) => `<div style="background:#fefce8;padding:14px 18px;border-radius:20px;margin:12px 0;"><strong>🔁 ${r.name}</strong> — ${r.cleared}/${r.total} cleared (${Math.round((r.cleared / r.total) * 100)}%)</div>`
    )
    .join("");
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${company.name} | Placement Drive Details</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;background:#f0f4f9;padding:40px 24px;} .container{max-width:1100px;margin:0 auto;background:white;border-radius:32px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.1);} .hero{background:linear-gradient(135deg,#1e293b,#0f172a);color:white;padding:28px 32px;} .hero h1{font-size:1.8rem;margin-bottom:6px;} .badge{background:#facc15;color:#0f172a;padding:4px 12px;border-radius:40px;font-size:0.75rem;display:inline-block;} .content{padding:32px;} .info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;background:#f8fafc;padding:24px;border-radius:24px;margin-bottom:30px;} .info-item strong{display:block;color:#475569;font-size:0.7rem;text-transform:uppercase;margin-bottom:6px;} .info-item span{font-size:0.95rem;font-weight:600;color:#0f172a;} .students-table{width:100%;border-collapse:collapse;margin:20px 0;border-radius:16px;overflow:hidden;} .students-table th,.students-table td{padding:12px;text-align:left;border-bottom:1px solid #e2e8f0;} .students-table th{background:#f1f5f9;font-weight:600;} h3{margin:28px 0 16px 0;color:#1f4f2d;border-left:4px solid #2b7e3a;padding-left:14px;font-size:1.2rem;} .back-btn{background:#0f3b2c;color:white;padding:10px 24px;border-radius:40px;border:none;cursor:pointer;margin-bottom:20px;font-weight:500;} .back-btn:hover{background:#1c5e44;} .rounds-section{margin:25px 0;}</style></head><body><div class="container"><div class="hero"><span class="badge">${company.type} · ${company.batch} Batch</span><h1>🏢 ${company.name} | ${company.designation}</h1><p>📅 Drive Date: ${company.conductedDate} | 📍 ${company.location}</p></div><div class="content"><button class="back-btn" onclick="window.close()">← Close Window</button><div class="info-grid"><div class="info-item"><strong>💰 PACKAGE (CTC)</strong><span>${company.package}</span></div><div class="info-item"><strong>📍 LOCATION</strong><span>${company.location}</span></div><div class="info-item"><strong>📂 ELIGIBLE DEPARTMENTS</strong><span>${company.departments.join(", ")}</span></div><div class="info-item"><strong>🏅 HIGHEST PACKAGE</strong><span>${company.highestPackage}</span></div><div class="info-item"><strong>🏛️ VENUE</strong><span>${company.venue}</span></div><div class="info-item"><strong>👤 HR CONTACT</strong><span>${company.hrName}<br>📧 ${company.hrEmail}<br>📞 ${company.hrPhone}</span></div><div class="info-item"><strong>📊 AVERAGE PACKAGE</strong><span>${company.avgPackage}</span></div><div class="info-item"><strong>🎯 DESIGNATION</strong><span>${company.designation}</span></div><div class="info-item"><strong>📄 DESCRIPTION</strong><span>${company.description}</span></div></div><h3>🔁 Recruitment Rounds</h3><div class="rounds-section">${roundsHtml}</div><h3>📌 Placed Students (${company.placedStudents.length})</h3><table class="students-table"><thead><tr><th>Student</th><th>Roll No</th><th>Dept</th><th>Batch</th><th>CGPA</th><th>Package</th><th>Role</th></tr></thead><tbody>${studentsRows}</tbody></table><div style="margin-top:30px;padding:16px;background:#e0f2fe;border-radius:20px;text-align:center;font-size:0.8rem;">📢 Total students recruited: ${company.placedStudents.length} | Highest CTC: ${company.highestPackage}</div></div></div></body></html>`;
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const avatarColors = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export default function PlacementCompanies() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [activeFilters, setActiveFilters] = useState({ department: null, type: null, batch: null });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [messageCompany, setMessageCompany] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [toast, setToast] = useState("");
  const nextId = useRef(5);
  const [newCompany, setNewCompany] = useState({
    name: "",
    type: "IT",
    batch: "2025",
    rating: "4.0",
    location: "",
    package: "",
    highestPackage: "",
    avgPackage: "",
    conductedDate: "",
    venue: "",
    designation: "",
    hrName: "",
    hrEmail: "",
    hrPhone: "",
    description: "",
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const allDepartments = useMemo(
    () => [...new Set(companies.flatMap((company) => company.departments))].sort(),
    [companies]
  );
  const companyTypes = useMemo(
    () => [...new Set(companies.map((company) => company.type))].sort(),
    [companies]
  );
  const batches = useMemo(
    () => [...new Set(companies.map((company) => company.batch))].sort(),
    [companies]
  );

  const filteredCompanies = useMemo(
    () =>
      companies.filter(
        (company) =>
          !(activeFilters.department && !company.departments.includes(activeFilters.department)) &&
          !(activeFilters.type && company.type !== activeFilters.type) &&
          !(activeFilters.batch && company.batch !== activeFilters.batch)
      ),
    [companies, activeFilters]
  );

  const computeStats = (list) => {
    if (!list.length) {
      return {
        totalCompanies: 0,
        totalPlaced: 0,
        mostHired: { count: 0, name: "N/A" },
        leastHired: { count: 0, name: "N/A" },
        highestPackage: { value: 0, name: "N/A" },
        lowestPackage: { value: 0, name: "N/A" },
      };
    }
    let totalPlaced = 0;
    let mostHired = { count: -1, name: "" };
    let leastHired = { count: Infinity, name: "" };
    let highestPackage = { value: -1, name: "" };
    let lowestPackage = { value: Infinity, name: "" };
    list.forEach((company) => {
      const placed = company.placedStudents.length;
      totalPlaced += placed;
      if (placed > mostHired.count) mostHired = { count: placed, name: company.name };
      if (placed < leastHired.count) leastHired = { count: placed, name: company.name };
      const maxPackage = parseFloat(company.highestPackage) || 0;
      const minPackage = parseFloat(company.package) || 0;
      if (maxPackage > highestPackage.value) highestPackage = { value: maxPackage, name: company.name };
      if (minPackage < lowestPackage.value) lowestPackage = { value: minPackage, name: company.name };
    });
    return {
      totalCompanies: list.length,
      totalPlaced,
      mostHired,
      leastHired,
      highestPackage,
      lowestPackage,
    };
  };

  const stats = computeStats(filteredCompanies);

  const renderCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    let day = 1;

    for (let i = 0; i < 42; i += 1) {
      if (i < startDay || day > daysInMonth) {
        days.push({ empty: true });
      } else {
        const cellDate = new Date(currentYear, currentMonth, day);
        cellDate.setHours(0, 0, 0, 0);
        const status = companies.find((company) => company.conductedDate === cellDate.toISOString().slice(0, 10));
        const statusClass = status ? getDriveStatus(cellDate.toISOString().slice(0, 10)) : cellDate < today ? "overdue" : "";
        const isToday = cellDate.getTime() === today.getTime();
        days.push({ day, status: statusClass, today: isToday });
        day += 1;
      }
    }
    return days;
  };

  const openCompanyDetails = (company) => {
    const html = getCompanyDetailsPage(company);
    const blob = new Blob([html], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  const openMessageModal = (company) => {
    setMessageCompany(company);
    setMessageText(generateEmailMessage(company));
  };

  const closeMessageModal = () => {
    setMessageCompany(null);
    setMessageText("");
  };

  const handleSendWhatsApp = () => {
    if (!messageCompany) return;
    const cleanedPhone = messageCompany.hrPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`, "_blank");
    setToast(`WhatsApp opened for ${messageCompany.name}`);
    closeMessageModal();
  };

  const handleSendEmail = () => {
    if (!messageCompany) return;
    window.location.href = `mailto:${messageCompany.hrEmail}?subject=${encodeURIComponent(`Campus Recruitment Collaboration - SRM for ${messageCompany.name}`)}&body=${encodeURIComponent(messageText)}`;
    setToast(`Email draft for ${messageCompany.name}`);
    closeMessageModal();
  };

  const saveNewCompany = () => {
    if (!newCompany.name.trim()) {
      window.alert("Company Name required");
      return;
    }
    const builtCompany = {
      id: nextId.current,
      name: newCompany.name.trim(),
      type: newCompany.type,
      batch: newCompany.batch || "2025",
      rating: parseFloat(newCompany.rating) || 4.0,
      departments: ["CSE", "IT"],
      location: newCompany.location || "Chennai",
      conductedDate: newCompany.conductedDate || new Date().toISOString().slice(0, 10),
      venue: newCompany.venue || "Campus",
      package: `${newCompany.package || "15"} LPA`,
      highestPackage: `${newCompany.highestPackage || newCompany.package || "15"} LPA`,
      avgPackage: `${newCompany.avgPackage || newCompany.package || "15"} LPA`,
      designation: newCompany.designation || "Engineer",
      hrName: newCompany.hrName || "HR Team",
      hrEmail: newCompany.hrEmail || "hr@company.com",
      hrPhone: newCompany.hrPhone || "9999999999",
      description: newCompany.description || "New recruitment drive",
      placedStudents: [],
      rounds: [{ name: "Aptitude", cleared: 0, total: 0 }],
    };
    nextId.current += 1;
    setCompanies((prev) => [...prev, builtCompany]);
    setShowAddModal(false);
    setNewCompany({
      name: "",
      type: "IT",
      batch: "2025",
      rating: "4.0",
      location: "",
      package: "",
      highestPackage: "",
      avgPackage: "",
      conductedDate: "",
      venue: "",
      designation: "",
      hrName: "",
      hrEmail: "",
      hrPhone: "",
      description: "",
    });
    setToast(`✅ ${builtCompany.name} added!`);
  };

  const deleteCompany = () => {
    const name = window.prompt("Enter exact company name to delete:");
    if (!name) return;
    const index = companies.findIndex((company) => company.name.toLowerCase() === name.toLowerCase());
    if (index === -1) {
      window.alert("Not found");
      return;
    }
    if (window.confirm(`Delete "${companies[index].name}"?`)) {
      setCompanies((prev) => prev.filter((company) => company.name.toLowerCase() !== name.toLowerCase()));
      setToast(`🗑️ ${companies[index].name} deleted!`);
    }
  };

  const exportToExcel = () => {
    const data = [];
    filteredCompanies.forEach((company) => {
      if (company.placedStudents.length) {
        company.placedStudents.forEach((student) => {
          data.push({
            Company: company.name,
            Type: company.type,
            Batch: company.batch,
            Rating: company.rating,
            "Drive Date": company.conductedDate,
            Student: student.name,
            Package: student.package,
            Role: student.role,
          });
        });
      } else {
        data.push({
          Company: company.name,
          Type: company.type,
          Batch: company.batch,
          Rating: company.rating,
          "Drive Date": company.conductedDate,
          Student: "No placements",
        });
      }
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement_Report");
    XLSX.writeFile(workbook, `Placement_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setToast("📊 Exported!");
  };

  const analyticsData = useMemo(() => {
    const years = [...new Set(companies.map((company) => company.batch))].sort();
    return years.map((year) => {
      const comps = companies.filter((company) => company.batch === year);
      const placed = comps.reduce((sum, company) => sum + company.placedStudents.length, 0);
      const total = batchStudentCounts[year] || 300;
      return { year, placed, total, percentage: total > 0 ? ((placed / total) * 100).toFixed(1) : 0 };
    });
  }, [companies]);

  const changeMonth = (direction) => {
    const nextYear = currentMonth + direction < 0 ? currentYear - 1 : currentMonth + direction > 11 ? currentYear + 1 : currentYear;
    const nextMonth = (currentMonth + direction + 12) % 12;
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const resetFilters = () => setActiveFilters({ department: null, type: null, batch: null });

  const dialogBackgroundClick = (event, callback) => {
    if (event.target === event.currentTarget) callback();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="dashboard-container">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #f0f4f9; }
        .dashboard-container { max-width: 1400px; margin: 0 auto; padding: 28px 24px; }
        .filter-bar { background: white; border-radius: 60px; padding: 12px 24px; margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 20px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .filter-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .filter-group label { font-weight: 600; font-size: 0.8rem; color: #334155; }
        .filter-btn { background: #f1f5f9; border: none; padding: 6px 16px; border-radius: 40px; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
        .filter-btn.active { background: #1f5e3a; color: white; }
        .reset-btn { background: #e2e8f0; color: #1e293b; margin-left: auto; }
        .calendar-tracker-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
        .calendar-container, .tracker-container, .action-bar, .stat-card, .company-tile { background: white; }
        .calendar-container, .tracker-container { border-radius: 28px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 10px; }
        .calendar-header h3 { font-size: 1.2rem; color: #1f4f2d; font-weight: 600; }
        .calendar-nav { display: flex; gap: 12px; }
        .calendar-nav-btn { background: #f1f5f9; border: none; padding: 6px 14px; border-radius: 30px; cursor: pointer; font-weight: 500; }
        .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 600; font-size: 0.75rem; color: #64748b; margin-bottom: 10px; }
        .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .calendar-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 0.85rem; font-weight: 500; transition: 0.2s; cursor: pointer; }
        .calendar-day.completed { background: #22c55e; color: white; }
        .calendar-day.upcoming { background: #eab308; color: white; }
        .calendar-day.ongoing { background: #3b82f6; color: white; }
        .calendar-day.overdue { background: #ef4444; color: white; }
        .calendar-day.today { border: 2px solid #facc15; font-weight: bold; }
        .calendar-day.empty { background: transparent; cursor: default; }
        .calendar-legend { display: flex; gap: 20px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 0.7rem; flex-wrap: wrap; }
        .legend-color { width: 14px; height: 14px; border-radius: 4px; display: inline-block; margin-right: 6px; }
        .tracker-container h3 { font-size: 1.2rem; color: #1f4f2d; margin-bottom: 16px; font-weight: 600; }
        .drive-status-list { max-height: 300px; overflow-y: auto; }
        .drive-status-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0; cursor: pointer; transition: 0.2s; border-radius: 12px; }
        .drive-status-item:hover { background: #f8fafc; }
        .drive-info { flex: 1; }
        .drive-name { font-weight: 600; font-size: 0.9rem; }
        .drive-date { font-size: 0.7rem; color: #64748b; margin-top: 2px; }
        .drive-status-badge { padding: 4px 12px; border-radius: 30px; font-size: 0.7rem; font-weight: 600; }
        .status-upcoming { background: #fef3c7; color: #d97706; }
        .status-ongoing { background: #dbeafe; color: #2563eb; }
        .status-completed { background: #d1fae5; color: #059669; }
        .action-bar { border-radius: 60px; padding: 10px 24px; margin-bottom: 28px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .action-left, .action-right { display: flex; gap: 12px; flex-wrap: wrap; }
        .action-btn { padding: 8px 20px; border-radius: 40px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; border: none; }
        .add-btn { background: #2b7e3a; color: white; }
        .delete-btn { background: #dc2626; color: white; }
        .export-btn { background: #0f3b2c; color: white; }
        .analytics-btn { background: #8b5cf6; color: white; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-card { border-radius: 28px; padding: 20px 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .stat-card h3 { font-size: 0.75rem; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
        .stat-number { font-size: 2.2rem; font-weight: 800; color: #0f3b2c; }
        .stat-sub { font-size: 0.7rem; color: #475569; margin-top: 6px; }
        .companies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .company-tile { border-radius: 28px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: 1px solid #e2edf2; position: relative; }
        .company-tile:hover { transform: translateY(-4px); box-shadow: 0 16px 28px rgba(0,0,0,0.1); }
        .company-rating { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 30px; display: flex; align-items: center; gap: 4px; z-index: 10; }
        .rating-stars { display: flex; gap: 2px; }
        .star-filled { color: #facc15; font-size: 0.8rem; }
        .star-empty { color: #cbd5e1; font-size: 0.8rem; }
        .rating-value { font-size: 0.7rem; font-weight: 600; color: white; margin-left: 4px; }
        .tile-header { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 18px 20px; }
        .tile-header h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; }
        .tile-badge { display: inline-block; background: #facc15; color: #0f172a; padding: 2px 10px; border-radius: 30px; font-size: 0.7rem; font-weight: 600; }
        .tile-details { padding: 18px 20px; }
        .tile-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.85rem; }
        .placed-count { font-weight: 700; color: #2b7e3a; font-size: 1.1rem; }
        .action-buttons { display: flex; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #e2e8f0; }
        .whatsapp-btn, .email-btn { flex: 1; padding: 10px; border-radius: 40px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; }
        .whatsapp-btn { background: #25D366; color: white; }
        .email-btn { background: #3b82f6; color: white; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 60px; background: #f8fafc; border-radius: 40px; color: #64748b; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; max-width: 550px; width: 90%; max-height: 85vh; overflow-y: auto; border-radius: 32px; padding: 28px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; font-size: 0.8rem; margin-bottom: 5px; color: #334155; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border-radius: 14px; border: 1.5px solid #e2edf2; font-size: 0.9rem; }
        .modal-buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
        @media (max-width: 960px) { .calendar-tracker-row { grid-template-columns: 1fr; } }
      `}</style>
      <div className="filter-bar">
        <div className="filter-group">
          <label>📂 Department:</label>
          <div>
            <button
              type="button"
              className={`filter-btn ${!activeFilters.department ? "active" : ""}`}
              onClick={() => setActiveFilters((prev) => ({ ...prev, department: null }))}
            >
              All
            </button>
            {allDepartments.map((dept) => (
              <button
                type="button"
                key={dept}
                className={`filter-btn ${activeFilters.department === dept ? "active" : ""}`}
                onClick={() => setActiveFilters((prev) => ({ ...prev, department: prev.department === dept ? null : dept }))}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>🏢 Company Type:</label>
          <div>
            <button
              type="button"
              className={`filter-btn ${!activeFilters.type ? "active" : ""}`}
              onClick={() => setActiveFilters((prev) => ({ ...prev, type: null }))}
            >
              All
            </button>
            {companyTypes.map((type) => (
              <button
                type="button"
                key={type}
                className={`filter-btn ${activeFilters.type === type ? "active" : ""}`}
                onClick={() => setActiveFilters((prev) => ({ ...prev, type: prev.type === type ? null : type }))}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>🎓 Batch:</label>
          <div>
            <button
              type="button"
              className={`filter-btn ${!activeFilters.batch ? "active" : ""}`}
              onClick={() => setActiveFilters((prev) => ({ ...prev, batch: null }))}
            >
              All
            </button>
            {batches.map((batch) => (
              <button
                type="button"
                key={batch}
                className={`filter-btn ${activeFilters.batch === batch ? "active" : ""}`}
                onClick={() => setActiveFilters((prev) => ({ ...prev, batch: prev.batch === batch ? null : batch }))}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="filter-btn reset-btn" onClick={resetFilters}>
          ⟳ Reset Filters
        </button>
      </div>

      <div className="calendar-tracker-row">
        <div className="calendar-container">
          <div className="calendar-header">
            <h3>{`${monthNames[currentMonth]} ${currentYear}`}</h3>
            <div className="calendar-nav">
              <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
                ◀ Prev
              </button>
              <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(1)}>
                Next ▶
              </button>
            </div>
          </div>
          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="calendar-days">
            {renderCalendarDays().map((cell, index) => (
              <div
                key={index}
                className={`calendar-day ${cell.empty ? "empty" : cell.status} ${cell.today ? "today" : ""}`}
              >
                {!cell.empty && cell.day}
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <span>
              <span className="legend-color" style={{ background: "#22c55e" }} />Completed
            </span>
            <span>
              <span className="legend-color" style={{ background: "#eab308" }} />Upcoming
            </span>
            <span>
              <span className="legend-color" style={{ background: "#3b82f6" }} />Ongoing
            </span>
            <span>
              <span className="legend-color" style={{ background: "#ef4444" }} />Overdue
            </span>
            <span>
              <span className="legend-color" style={{ background: "white", border: "2px solid #facc15" }} />Today
            </span>
          </div>
        </div>
        <div className="tracker-container">
          <h3>📊 Drive Status Tracker</h3>
          <div className="drive-status-list">
            {companies
              .map((company) => ({ ...company, status: getDriveStatus(company.conductedDate) }))
              .sort((a, b) => ({ ongoing: 0, upcoming: 1, completed: 2 }[a.status] - { ongoing: 0, upcoming: 1, completed: 2 }[b.status]))
              .map((drive) => (
                <div
                  key={drive.id}
                  className="drive-status-item"
                  onClick={() => openCompanyDetails(drive)}
                >
                  <div className="drive-info">
                    <div className="drive-name">🏢 {drive.name} | {drive.designation}</div>
                    <div className="drive-date">📅 {drive.conductedDate} | 📍 {drive.location}</div>
                  </div>
                  <div className={`drive-status-badge ${
                    drive.status === "completed" ? "status-completed" : drive.status === "ongoing" ? "status-ongoing" : "status-upcoming"
                  }`}>
                    {drive.status === "completed" ? "✓ Completed" : drive.status === "ongoing" ? "🔄 Ongoing" : "⏳ Upcoming"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="action-left">
          <button type="button" className="action-btn add-btn" onClick={() => setShowAddModal(true)}>
            ➕ Add Company
          </button>
          <button type="button" className="action-btn delete-btn" onClick={deleteCompany}>
            🗑️ Delete Company
          </button>
          <button type="button" className="action-btn analytics-btn" onClick={() => setShowAnalytics(true)}>
            📈 Analytics
          </button>
        </div>
        <div className="action-right">
          <button type="button" className="action-btn export-btn" onClick={exportToExcel}>
            📊 Export to Excel
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <h3>🏢 COMPANIES VISITED</h3>
          <div className="stat-number">{stats.totalCompanies}</div>
          <div className="stat-sub">Total drives</div>
        </div>
        <div className="stat-card">
          <h3>✅ STUDENTS PLACED</h3>
          <div className="stat-number">{stats.totalPlaced}</div>
          <div className="stat-sub">Across companies</div>
        </div>
        <div className="stat-card">
          <h3>🏆 MOST HIRED</h3>
          <div className="stat-number">{stats.mostHired.count}</div>
          <div className="stat-sub">{stats.mostHired.name}</div>
        </div>
        <div className="stat-card">
          <h3>📉 LEAST HIRED</h3>
          <div className="stat-number">{stats.leastHired.count === Infinity ? 0 : stats.leastHired.count}</div>
          <div className="stat-sub">{stats.leastHired.name}</div>
        </div>
        <div className="stat-card">
          <h3>💎 HIGHEST PACKAGE</h3>
          <div className="stat-number">{stats.highestPackage.value} LPA</div>
          <div className="stat-sub">{stats.highestPackage.name}</div>
        </div>
        <div className="stat-card">
          <h3>📊 LOWEST PACKAGE</h3>
          <div className="stat-number">{stats.lowestPackage.value === Infinity ? 0 : stats.lowestPackage.value} LPA</div>
          <div className="stat-sub">{stats.lowestPackage.name}</div>
        </div>
      </div>

      <div className="companies-grid">
        {filteredCompanies.length === 0 ? (
          <div className="empty-state">📭 No companies match filters.</div>
        ) : (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="company-tile"
              onClick={() => openCompanyDetails(company)}
            >
              <div className="company-rating">
                <div className="rating-stars">
                  {getRatingStars(company.rating).map((star, index) => (
                    <span key={index} className={star === "☆" ? "star-empty" : "star-filled"}>{star}</span>
                  ))}
                </div>
                <span className="rating-value">{company.rating}</span>
              </div>
              <div className="tile-header">
                <h3>{company.name}</h3>
                <span className="tile-badge">{company.type} · {company.batch} Batch</span>
              </div>
              <div className="tile-details">
                <div className="tile-row"><span>📍 {company.location}</span><span>📅 {company.conductedDate}</span></div>
                <div className="tile-row"><span>🎯 {company.designation}</span><span>💰 {company.package}</span></div>
                <div className="tile-row"><span>🏛️ Venue: {company.venue}</span></div>
                <div className="tile-row"><span>📊 Placed: <strong className="placed-count">{company.placedStudents.length}</strong></span><span>🏅 Highest: {company.highestPackage}</span></div>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="whatsapp-btn comm-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      openMessageModal(company);
                    }}
                  >
                    📱 WhatsApp HR
                  </button>
                  <button
                    type="button"
                    className="email-btn comm-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      openMessageModal(company);
                    }}
                  >
                    ✉️ Email HR
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={(event) => dialogBackgroundClick(event, () => setShowAddModal(false))}>
          <div className="modal-content">
            <h3>➕ Add New Company</h3>
            <div className="form-group">
              <label>Company Name</label>
              <input value={newCompany.name} onChange={(e) => setNewCompany((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g., Netflix" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={newCompany.type} onChange={(e) => setNewCompany((prev) => ({ ...prev, type: e.target.value }))}>
                <option>IT</option>
                <option>Core</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Batch</label>
              <input value={newCompany.batch} onChange={(e) => setNewCompany((prev) => ({ ...prev, batch: e.target.value }))} placeholder="2025" />
            </div>
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={newCompany.rating} onChange={(e) => setNewCompany((prev) => ({ ...prev, rating: e.target.value }))} placeholder="4.5" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={newCompany.location} onChange={(e) => setNewCompany((prev) => ({ ...prev, location: e.target.value }))} placeholder="Bangalore" />
            </div>
            <div className="form-group">
              <label>Package (LPA)</label>
              <input value={newCompany.package} onChange={(e) => setNewCompany((prev) => ({ ...prev, package: e.target.value }))} placeholder="15" />
            </div>
            <div className="form-group">
              <label>Drive Date</label>
              <input value={newCompany.conductedDate} onChange={(e) => setNewCompany((prev) => ({ ...prev, conductedDate: e.target.value }))} placeholder="2025-05-20" />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input value={newCompany.designation} onChange={(e) => setNewCompany((prev) => ({ ...prev, designation: e.target.value }))} placeholder="Engineer" />
            </div>
            <div className="form-group">
              <label>HR Name</label>
              <input value={newCompany.hrName} onChange={(e) => setNewCompany((prev) => ({ ...prev, hrName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>HR Email</label>
              <input value={newCompany.hrEmail} onChange={(e) => setNewCompany((prev) => ({ ...prev, hrEmail: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>HR Phone</label>
              <input value={newCompany.hrPhone} onChange={(e) => setNewCompany((prev) => ({ ...prev, hrPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" value={newCompany.description} onChange={(e) => setNewCompany((prev) => ({ ...prev, description: e.target.value }))} placeholder="Describe the drive..." />
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={saveNewCompany} style={{ background: "#2b7e3a", color: "white", padding: "10px 20px", borderRadius: "40px" }}>
                Save
              </button>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: "#e2e8f0", padding: "10px 20px", borderRadius: "40px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {messageCompany && (
        <div className="modal-overlay" onClick={(event) => dialogBackgroundClick(event, closeMessageModal)}>
          <div className="modal-content">
            <button onClick={closeMessageModal} style={{ float: "right", background: "#fee2e2", border: "none", borderRadius: "40px", padding: "6px 16px", cursor: "pointer" }}>
              ✖ Close
            </button>
            <h3>📧 Send to {messageCompany.name}</h3>
            <textarea
              id="msgEditor"
              style={{ width: "100%", minHeight: "400px", padding: "16px", border: "1px solid #cbd5e1", borderRadius: "20px", fontFamily: "monospace", fontSize: "12px", margin: "15px 0" }}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" onClick={handleSendWhatsApp} style={{ background: "#25D366", color: "white", padding: "10px 20px", borderRadius: "40px" }}>
                📱 WhatsApp
              </button>
              <button type="button" onClick={handleSendEmail} style={{ background: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "40px" }}>
                ✉️ Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalytics && (
        <div className="modal-overlay" onClick={(event) => dialogBackgroundClick(event, () => setShowAnalytics(false))}>
          <div className="modal-content">
            <h2>📊 Placement Analytics</h2>
            <div style={{ margin: "20px 0" }}>
              <h3>📈 Year-over-Year Comparison</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {analyticsData.map((year) => (
                  <div key={year.year} style={{ background: "#f8fafc", borderRadius: "20px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f3b2c" }}>{year.percentage}%</div>
                    <div>{year.year} Batch</div>
                    <div style={{ fontSize: "0.75rem" }}>{year.placed}/{year.total} placed</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ margin: "20px 0" }}>
              <h3>🏢 Company Hiring</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {companies.map((company) => (
                  <div key={company.id} style={{ background: "#f8fafc", borderRadius: "20px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f3b2c" }}>{company.placedStudents.length}</div>
                    <div>{company.name}</div>
                    <div style={{ fontSize: "0.75rem" }}>⭐ {company.rating} | {company.package}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ margin: "20px 0" }}>
              <h3>📊 Batch-wise Placement</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {analyticsData.map((year) => (
                  <div key={year.year} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", borderRadius: "20px", padding: "16px", textAlign: "center", color: "white" }}>
                    <div>🎓 {year.year} Batch</div>
                    <div style={{ fontSize: "2rem", fontWeight: 800 }}>{year.percentage}%</div>
                    <div>{year.placed}/{year.total} placed</div>
                    <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: "20px", height: "6px", marginTop: "10px" }}>
                      <div style={{ background: "#facc15", width: `${year.percentage}%`, height: "6px", borderRadius: "20px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button type="button" id="closeAnalytics" onClick={() => setShowAnalytics(false)} style={{ background: "#0f3b2c", color: "white", padding: "10px 24px", borderRadius: "40px", border: "none", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", background: "#0f3b2c", color: "white", padding: "12px 24px", borderRadius: "50px", zIndex: 1100 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

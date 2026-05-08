import { useEffect, useState } from "react";
import API from "../services/api";

export default function Development() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    API.get("api/students/student/placement-drives/", token)
      .then((data) => {
        const parsedDrives = (Array.isArray(data) ? data : []).map((drive) => ({
          ...drive,
          criteria_parsed: drive.criteria
            ? (() => {
                try {
                  return JSON.parse(drive.criteria);
                } catch (e) {
                  return {};
                }
              })()
            : {},
        }));
        setDrives(parsedDrives);
      })
      .catch((err) => setError(err?.message || "Unable to load placement drives."))
      .finally(() => setLoading(false));
  }, []);

  const totalDrives = drives.length;
  const totalPlacedOffers = drives.reduce((sum, drive) => sum + (drive.total_placed || 0), 0);
  const totalAppliedOffers = drives.reduce((sum, drive) => sum + (drive.total_applied || 0), 0);

  const formatDate = (value) => {
    if (!value) return "TBA";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  const formatList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    return String(value).split(",").map((item) => item.trim()).filter(Boolean);
  };

  const statusLabel = (status) => {
    if (status === "placed") return "✓ Placed";
    if (status === "applied") return "Applied";
    if (status === "shortlisted") return "Shortlisted";
    return "Not Applied";
  };

  const renderRoundItem = (round, index, total) => (
    <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 0", borderBottom: index + 1 < total ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
      <div style={{ background: "#facc15", color: "#0f172a", width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>
        {index + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>{round.title || `Round ${index + 1}`}</div>
        <div style={{ fontSize: "0.75rem", opacity: 0.75, marginTop: "4px", color: "#f8f9fa" }}>
          {round.date ? `📅 ${formatDate(round.date)}` : "📅 Date TBA"}{round.time ? ` ⏰ ${round.time}` : ""}
        </div>
        {round.desc && <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "6px", color: "#e2e8f0" }}>{round.desc}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "linear-gradient(135deg, #f0f4f9 0%, #e2e8f0 100%)", fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "#fff", padding: "16px 28px", borderRadius: "80px", boxShadow: "0 16px 40px rgba(15,23,42,0.08)" }}>
            <span style={{ fontSize: "28px" }}>🎓</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "2.2rem", color: "#0a2b3e" }}>Student Placement Dashboard</h1>
              <p style={{ margin: "10px 0 0", color: "#475569", fontSize: "0.95rem" }}>Official notice board • view-only drive information</p>
            </div>
          </div>
        </div>

        {loading && <p style={{ textAlign: "center", color: "#334155" }}>Loading placement drives...</p>}
        {error && <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>}

        {!loading && !error && (
          <>
            {totalDrives > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "24px" }}>
                <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.06)" }}>
                  <div style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Active Drives</div>
                  <div style={{ fontSize: "42px", fontWeight: 800, color: "#0e4e96" }}>{totalDrives}</div>
                  <div style={{ marginTop: "10px", color: "#64748b", fontSize: "14px" }}>Drives currently available for your profile</div>
                </div>
                <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.06)" }}>
                  <div style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Students Placed</div>
                  <div style={{ fontSize: "42px", fontWeight: 800, color: "#16a34a" }}>{totalPlacedOffers}</div>
                  <div style={{ marginTop: "10px", color: "#64748b", fontSize: "14px" }}>Total placed students across these drives</div>
                </div>
                <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.06)" }}>
                  <div style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Applications Received</div>
                  <div style={{ fontSize: "42px", fontWeight: 800, color: "#c2410c" }}>{totalAppliedOffers}</div>
                  <div style={{ marginTop: "10px", color: "#64748b", fontSize: "14px" }}>Total applied offers across drives</div>
                </div>
              </div>
            )}

            {totalDrives === 0 ? (
              <div style={{ background: "#fff", borderRadius: "32px", padding: "64px 48px", boxShadow: "0 30px 70px rgba(15,23,42,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "58px", marginBottom: "22px" }}>📣</div>
                <h2 style={{ margin: 0, fontSize: "2rem", color: "#0f172a" }}>No Active Placement Drives</h2>
                <p style={{ margin: "18px auto 0", maxWidth: "640px", color: "#64748b", fontSize: "1rem" }}>Please check back later for updates from the Placement Office. Drive details will appear here once they are published.</p>
                <p style={{ marginTop: "24px", color: "#94a3b8", fontSize: "0.9rem" }}>Latest updates from placement cell | Information is read-only</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "30px" }}>
                {drives.map((drive) => {
                  const criteria = drive.criteria_parsed || {};
                  const batches = formatList(criteria.eligible_batches).join(" • ");
                  const departments = formatList(criteria.eligible_departments).join(", ");
                  const perks = formatList(criteria.perks);
                  const skills = formatList(criteria.expected_skills);
                  const rounds = Array.isArray(criteria.rounds) ? criteria.rounds : [];
                  const contact = criteria.contact_person || {};
                  const academic = [];
                  if (criteria.min_10th_percentage) academic.push(`10th: ${criteria.min_10th_percentage}%`);
                  if (criteria.min_12th_percentage) academic.push(`12th: ${criteria.min_12th_percentage}%`);

                  return (
                    <div key={drive.id} style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "#f8fafc", borderRadius: "28px", padding: "32px", boxShadow: "0 28px 70px rgba(15,23,42,0.16)", overflow: "hidden" }}>
                      <div style={{ borderBottom: "1px solid rgba(248,250,252,0.12)", paddingBottom: "20px", marginBottom: "26px" }}>
                        <h2 style={{ margin: 0, fontSize: "1.95rem", fontWeight: 700, letterSpacing: "-0.3px", color: "#facc15" }}>
                          {drive.company_name}{criteria.job_role ? ` | ${criteria.job_role}` : ""}
                        </h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "14px", color: "rgba(241,245,249,0.8)", fontSize: "0.9rem" }}>
                          <span>📅 Published: {formatDate(drive.drive_date)}</span>
                          <span>🆔 Drive ID: {drive.id}</span>
                          <span>🏷️ Status: {statusLabel(drive.my_status)}</span>
                        </div>
                      </div>

                      {criteria.company_history && (
                        <div style={{ marginBottom: "24px", lineHeight: 1.8, color: "rgba(248,250,252,0.9)" }}>
                          {criteria.company_history}
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "18px", marginBottom: "24px" }}>
                        {[
                          { label: "💰 CTC / Package", value: criteria.package || "TBA" },
                          { label: "📊 Number of Vacancies", value: criteria.vacancies || "TBA" },
                          { label: "📍 Drive Location", value: criteria.location || "TBA" },
                          { label: "📅 Drive Date", value: formatDate(drive.drive_date) },
                          { label: "⏰ Last Date to Apply", value: formatDate(criteria.last_date_to_apply) },
                          { label: "🎓 Eligible Batches", value: batches || "TBA" },
                          { label: "🎯 Eligible Departments", value: departments || "TBA" },
                          { label: "📋 Minimum CGPA", value: criteria.min_cgpa ? `${criteria.min_cgpa} / 10` : "TBA" },
                          { label: "📊 Academic Criteria", value: academic.length > 0 ? academic.join(" | ") : "TBA" },
                          { label: "📌 Arrears Policy", value: criteria.arrears_allowed || "TBA" },
                          { label: "🏷️ Service Bond", value: criteria.bond?.period ? `${criteria.bond.period}${criteria.bond.amount ? ` (${criteria.bond.amount})` : ""}` : "No Bond" },
                          { label: "📱 Shortlist Limit", value: criteria.shortlist_limit || "TBA" },
                        ].map((card) => (
                          <div key={card.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "18px", border: "1px solid rgba(255,255,255,0.12)" }}>
                            <strong style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75, marginBottom: "10px" }}>{card.label}</strong>
                            <span style={{ fontSize: "1rem", lineHeight: 1.6, color: "#f8fafc" }}>{card.value}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: "24px" }}>
                        <strong style={{ display: "block", color: "#f8fafc", marginBottom: "12px", fontSize: "1rem" }}>🎁 Perks & Benefits</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {perks.length > 0 ? perks.map((perk, idx) => (
                            <span key={idx} style={{ background: "rgba(250,204,21,0.18)", color: "#facc15", padding: "8px 16px", borderRadius: "40px", fontSize: "0.82rem", fontWeight: 500 }}>{perk}</span>
                          )) : (
                            <span style={{ color: "rgba(241,245,249,0.8)", fontSize: "0.95rem" }}>No perks listed</span>
                          )}
                        </div>
                      </div>

                      {skills.length > 0 && (
                        <div style={{ marginBottom: "24px" }}>
                          <strong style={{ display: "block", color: "#f8fafc", marginBottom: "12px", fontSize: "1rem" }}>💡 Expected Skills</strong>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {skills.map((skill, idx) => (
                              <span key={idx} style={{ background: "rgba(227,242,253,0.18)", color: "#dbeafe", padding: "8px 14px", borderRadius: "999px", fontSize: "0.85rem" }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {rounds.length > 0 && (
                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "24px", padding: "22px", marginBottom: "22px" }}>
                          <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", color: "#facc15" }}>🔁 Recruitment Rounds (Schedule)</h4>
                          <div style={{ marginTop: "18px" }}>
                            {rounds.map((round, idx) => renderRoundItem(round, idx, rounds.length))}
                          </div>
                        </div>
                      )}

                      <div style={{ background: "rgba(250,204,21,0.08)", borderLeft: "4px solid #facc15", padding: "18px 22px", borderRadius: "18px", marginBottom: "16px" }}>
                        <strong style={{ display: "block", marginBottom: "10px", color: "#a16207" }}>📢 Important Instructions</strong>
                        <div style={{ color: "#755a0c", lineHeight: 1.8, fontSize: "0.95rem" }}>
                          Carry a printed copy of your resume and valid ID. Report on time for the drive. Eligible students will receive venue details on registered email and SMS.
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "18px", border: "1px solid rgba(255,255,255,0.12)" }}>
                          <div style={{ fontSize: "0.8rem", opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>HR Contact Person</div>
                          <div style={{ fontSize: "0.95rem", color: "#f8fafc" }}>{contact.name || "Not provided"}</div>
                          {contact.designation && <div style={{ marginTop: "6px", opacity: 0.8 }}>{contact.designation}</div>}
                          {contact.email && <div style={{ marginTop: "8px", fontSize: "0.85rem", opacity: 0.8 }}>📧 {contact.email}</div>}
                          {contact.phone && <div style={{ marginTop: "4px", fontSize: "0.85rem", opacity: 0.8 }}>📞 {contact.phone}</div>}
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "18px", border: "1px solid rgba(255,255,255,0.12)" }}>
                          <div style={{ fontSize: "0.8rem", opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Document</div>
                          {drive.document ? (
                            <a href={drive.document} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>View Drive Document</a>
                          ) : (
                            <div style={{ color: "rgba(241,245,249,0.8)" }}>No document attached</div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: "28px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.12)", color: "rgba(241,245,249,0.75)", fontSize: "0.9rem", textAlign: "center" }}>
                        ⚡ This is a static prototype dashboard. All information is read-only — students cannot apply or modify any field.
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const categoryLabels = {
  semester: "Semester Feedback",
  event: "Event Feedback",
  faculty: "Faculty Feedback",
  general: "General Feedback",
};

const parseFeedbackResponseText = (responseText) => {
  if (!responseText) return null;
  if (typeof responseText !== "string") return responseText;
  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
};

export default function FeedbackComments() {
  const { category } = useParams();
  const [feedbackResults, setFeedbackResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/students/feedback-results/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unable to load feedback comments");
        }
        const data = await res.json();
        setFeedbackResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load feedback comments");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  const filteredForms = (feedbackResults || []).filter(
    (form) => (form.form_type || "semester") === category
  );

  const commentRows = filteredForms.flatMap((form, formIndex) => {
    const responses = Array.isArray(form.responses) ? form.responses : [];
    return responses
      .map((response, responseIndex) => {
        const parsed = parseFeedbackResponseText(response.response || response.response_text);
        const comment = parsed?.comments || "";
        if (!comment || comment.toString().trim() === "") return null;
        return {
          key: `${form.form_id ?? form.id ?? formIndex}-comment-${responseIndex}`,
          formTitle: form.title || `Feedback ${formIndex + 1}`,
          comment: comment.toString(),
          submittedAt: parsed?.submitted_at || "",
        };
      })
      .filter(Boolean);
  });

  return (
    <div style={{ padding: "24px" }}>
      <h1>{categoryLabels[category] || "Feedback Comments"}</h1>
      <p style={{ marginBottom: "16px" }}>
        Here are the comments submitted by students for the selected feedback category. Student names have been removed.
      </p>

      <div style={{ marginBottom: "16px" }}>
        <Link
          to="/staff/dashboard"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Back to Staff Dashboard
        </Link>
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : commentRows.length === 0 ? (
        <p>No comments available for this category yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px" }}>Feedback Form</th>
                <th style={{ padding: "10px" }}>Comment</th>
                <th style={{ padding: "10px" }}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {commentRows.map((row) => (
                <tr key={row.key}>
                  <td style={{ padding: "10px" }}>{row.formTitle}</td>
                  <td style={{ padding: "10px" }}>{row.comment}</td>
                  <td style={{ padding: "10px" }}>{row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

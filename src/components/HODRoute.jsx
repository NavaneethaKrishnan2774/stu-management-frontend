import { Navigate } from "react-router-dom";

const normalizeToken = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

const isHodUser = ({ role, designation }) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedDesignation = String(designation || "").trim().toLowerCase();

  return (
    normalizedRole === "hod" ||
    normalizedDesignation === "hod" ||
    (normalizedRole === "staff" && normalizedDesignation === "hod")
  );
};

const clearHodStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("designation");
  localStorage.removeItem("department");
  localStorage.removeItem("year");
  localStorage.removeItem("section");
};

export default function HODRoute({ children }) {
  const token = normalizeToken(localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const designation = localStorage.getItem("designation");

  if (!token || !isHodUser({ role, designation })) {
    clearHodStorage();
    return <Navigate to="/hod/login" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";

const normalizeToken = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

const isPlacementOfficer = (role, designation) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedDesignation = String(designation || "").trim().toLowerCase();
  return normalizedRole === "staff" && normalizedDesignation === "placement_officer";
};

const clearPlacementOfficerStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("designation");
};

export default function PlacementOfficerRoute({ children }) {
  const token = normalizeToken(localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const designation = localStorage.getItem("designation");

  if (!token || !isPlacementOfficer(role, designation)) {
    clearPlacementOfficerStorage();
    return <Navigate to="/staff/roles" replace />;
  }

  return children;
}
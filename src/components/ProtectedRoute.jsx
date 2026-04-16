import { Navigate } from "react-router-dom";

const normalizeToken = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

export default function ProtectedRoute({ children }) {
  const token = normalizeToken(localStorage.getItem("token"));

  if (!token) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }

  return children;
}
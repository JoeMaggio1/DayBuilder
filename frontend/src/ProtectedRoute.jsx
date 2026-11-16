import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  // Temporary integration point until frontend authentication is implemented.
  // Token presence is only a UI routing check, not proof of authentication.
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

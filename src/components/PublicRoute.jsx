import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function PublicRoute() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { MUTED } from "../theme.js";

function AdminRoute() {
  const { token, role, loadingUser } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p style={{ color: MUTED }}>Carregando...</p>
      </div>
    );
  }

  if (role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;

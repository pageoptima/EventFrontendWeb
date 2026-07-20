import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Carry the attempted URL so login/register can send the user back here
    // (e.g. opening a shared event/teaser link while logged out).
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

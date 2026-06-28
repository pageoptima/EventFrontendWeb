import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

// Prevents authenticated users from accessing /auth/login and /auth/register.
// Redirects them back to wherever they came from, or / by default.
function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;

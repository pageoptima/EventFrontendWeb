import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Send the user back to whatever page redirected them here (e.g. a
    // shared event/teaser link) instead of always landing on home.
    const from = location.state?.from;
    return <Navigate to={from ? `${from.pathname}${from.search}` : "/"} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;

import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import PublicRoute from "@/app/router/PublicRoute";
import AppLayout from "@/app/layouts/AppLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import {
  Chats,
  CreateEvent,
  CreateTeaser,
  Home,
  Login,
  NotFound,
  EventDetail,
  Profile,
  UserProfile,
  Register,
  Search,
  Settings,
  Teaser,
} from "@/features";

const router = createBrowserRouter([
  // Protected — authenticated users only
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "search", element: <Search /> },
          { path: "teaser", element: <Teaser /> },
          { path: "chats", element: <Chats /> },
          { path: "profile", element: <Profile /> },
          { path: "profile/:id", element: <UserProfile /> },
          { path: "create-event", element: <CreateEvent /> },
          { path: "create-teaser", element: <CreateTeaser /> },
          { path: "events/:eventId", element: <EventDetail /> },
          { path: "settings", element: <Settings /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
  // Public — unauthenticated users only (redirects away if already logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
    ],
  },
]);

export default router;

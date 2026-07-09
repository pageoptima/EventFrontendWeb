import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import PublicRoute from "@/app/router/PublicRoute";
import AppLayout from "@/app/layouts/AppLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import {
  Chats,
  CreatePost,
  CreateTeaser,
  CreateLiveEvent,
  Home,
  Login,
  NotFound,
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
          { path: "create-post", element: <CreatePost /> },
          { path: "create-teaser", element: <CreateTeaser /> },
          { path: "create-live-event", element: <CreateLiveEvent /> },
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

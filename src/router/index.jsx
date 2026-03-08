import { Navigate, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import {
  Chats,
  CreateEvent,
  Home,
  Login,
  NotFound,
  Profile,
  Register,
  Search,
  Settings,
  Teaser,
} from "@/pages";

const router = createBrowserRouter([
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
          { path: "create-event", element: <CreateEvent /> },
          { path: "settings", element: <Settings /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;

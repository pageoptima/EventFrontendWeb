import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/stores/slices/authSlice";

function useAuth() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  return { isAuthenticated, user };
}

export { useAuth };

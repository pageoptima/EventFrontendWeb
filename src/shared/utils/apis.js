import axios from "axios";
import { API_BASE_URL } from "@/shared/utils/config";
import { HTTP_STATUS } from "@/shared/utils/constants";
import { store } from "@/stores/appStore";
import {
  clearCredentials,
  selectAccessToken,
} from "@/stores/slices/authSlice";

// Import graph is acyclic: authSlice → (none), appStore → authSlice, apis → appStore + authSlice

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach Bearer token from Redux store on every outgoing request
api.interceptors.request.use((config) => {
  const token = selectAccessToken(store.getState());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: clear credentials — ProtectedRoute will redirect to /auth/login automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      store.dispatch(clearCredentials());
    }
    return Promise.reject(error);
  },
);

export default api;

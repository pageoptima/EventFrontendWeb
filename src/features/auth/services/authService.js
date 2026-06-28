import api from "@/shared/utils/apis";

/**
 * POST /auth/login
 * @returns {{ accessToken: string }}
 */
export const login = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);

/**
 * POST /auth/register
 * @returns {{ accessToken: string }}
 */
export const register = (credentials) =>
  api.post("/auth/register", credentials).then((r) => r.data);

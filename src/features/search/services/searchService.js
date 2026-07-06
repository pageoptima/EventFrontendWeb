import api from "@/shared/utils/apis";

export const searchUsers = (q, { limit = 20, offset = 0 } = {}) =>
  api.get("/users/search", { params: { q, limit, offset } }).then((r) => r.data);

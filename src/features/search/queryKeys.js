export const searchKeys = {
  all: ["search"],
  users: (q) => [...searchKeys.all, "users", q],
};

export const profileKeys = {
  all: ["profile"],
  me: () => [...profileKeys.all, "me"],
  user: (id) => [...profileKeys.all, "user", id],
};

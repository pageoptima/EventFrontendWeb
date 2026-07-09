export const postKeys = {
  all: ["post"],
  draft: (id) => [...postKeys.all, "draft", id],
};

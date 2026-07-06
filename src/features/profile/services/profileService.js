import api from "@/shared/utils/apis";

export const getMyProfile = () =>
  api.get("/profile/me").then((r) => r.data);

export const getUserProfile = (id) =>
  api.get(`/profile/${id}`).then((r) => r.data);

const multipart = { headers: { "Content-Type": undefined } };

export const updateProfilePicture = (file) => {
  const form = new FormData();
  form.append("image", file);
  return api.patch("/profile/picture", form, multipart).then((r) => r.data);
};

export const updateCoverPicture = (file) => {
  const form = new FormData();
  form.append("image", file);
  return api.patch("/profile/cover-picture", form, multipart).then((r) => r.data);
};

import axios from "@/lib/axios";

export const currentUser = async (token) =>
  await axios.post(
    "/api/current-user/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const currentAdmin = async (token) => {
  return await axios.post(
    "/api/current-admin/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

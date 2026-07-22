import axios from "@/lib/axios";

export const createCategory = async (token, form) => {
  return await axios.post("/api/category/", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listCategory = async () => {
  return await axios.get("/api/category/");
};

export const removeCategory = async (token, id) => {
  return await axios.delete("/api/category/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import axios from "@/lib/axios";

export const listDepartment = async () => {
  return await axios.get("/api/department/");
};
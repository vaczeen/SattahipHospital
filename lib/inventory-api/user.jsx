import axios from "@/lib/axios";

export const createUserCart = async (token, cart) => {
  return axios.post("/api/user/cart/", cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listUserCart = async (token) => {
  return axios.get("/api/user/cart/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveOffice = async (token, form) => {
  return axios.post(
    "/api/user/department/",
    { office: form.office, dept: form.dept, deptcode: form.deptcode, orderId: form.orderId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const saveOrder = async (token, payload) => {
  return axios.post("/api/user/order/", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrders = async (token) => {
  return axios.get("/api/user/order/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

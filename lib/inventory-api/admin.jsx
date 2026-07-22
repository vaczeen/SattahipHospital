import axios from "@/lib/axios";

export const getOrdersAdmin = async (token) => {
    return await axios.get("/api/admin-ecom/orders/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const changeOrderStatus = async (token, orderId, orderStatus) => {
    return await axios.put("/api/admin-ecom/order-status/", { orderId, orderStatus }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getListAllUser = async (token) => {
    return await axios.get("/api/users/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const changeUserStatus = async (token, value) => {
    return axios.post("/api/change-status/", value, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const changeUserRole = async (token, value) => {
    return axios.post("/api/change-role/", value, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
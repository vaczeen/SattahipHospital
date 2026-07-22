import axios from "@/lib/axios";

export const createReceiveRecord = async (token, form) => {
    return await axios.post("/api/receive/", form, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const listReceiveHistory = async (token) => {
    return await axios.get("/api/receive/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const removeReceiveRecord = async (token, id) => {
    return await axios.delete("/api/receive/" + id, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

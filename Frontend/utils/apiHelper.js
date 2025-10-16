import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true
});

// ==================== AUTH ====================

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`); // send GET request to backend's googleLogin route
export const getCurrUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");

// ================= TRANSACTIONS =================
export const createTransaction = (data) => api.post("/transaction", data);
export const getTransaction = (params) => api.get("/transaction", {params})
export const getDashboardData = () => api.get("/transaction/dashboardData");

// ================= LIMITS =================
export const createLimit = (data) => api.post("/limit", data);
export const getLimits = () => api.get("/limit");
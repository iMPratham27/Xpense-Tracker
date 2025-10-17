import axios from "axios";

// Detect environment automatically
const isLocalhost = window.location.hostname === "localhost";

const baseURL = isLocalhost
  ? "http://localhost:8000/api"  // Local backend
  : import.meta.env.VITE_API_URL; // Deployed backend

const api = axios.create({
    baseURL,
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
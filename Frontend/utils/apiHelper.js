import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/auth",
    withCredentials: true
});

// send GET request to backend's googleLogin route
export const googleAuth = (code) => api.get(`/google?code=${code}`);

export const getCurrUser = () => api.get("/me");

export const logoutUser = () => api.post("/logout");
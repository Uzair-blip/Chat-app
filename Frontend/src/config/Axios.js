import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Add a space after "Bearer"
    }
});

export default axiosInstance;

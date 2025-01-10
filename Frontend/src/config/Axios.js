import axios from "axios";

// Create the axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Get the latest token
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

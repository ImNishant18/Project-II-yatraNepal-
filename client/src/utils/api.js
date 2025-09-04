import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8800/api",
    withCredentials: true, 
});

api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.warn("Failed to parse user from localStorage:", error);
    }
    return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
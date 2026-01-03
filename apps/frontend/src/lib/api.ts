import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  } 
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth")
      ) {
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

export default api;

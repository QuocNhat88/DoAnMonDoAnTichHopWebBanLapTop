// src/api/axiosClient.js
import axios from "axios";

// Nếu có biến môi trường thì dùng, không có thì tự lùi về dùng link Render
const baseURL =
  import.meta.env.VITE_BACKEND_URL || "https://backendmodular.onrender.com/api";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  if (token) {
    // Nếu có token, đính nó vào Header theo chuẩn: Bearer [token]
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// -------------------------

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  },
);

export default axiosClient;

// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
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

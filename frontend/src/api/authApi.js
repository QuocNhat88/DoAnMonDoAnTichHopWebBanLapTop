// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  // Hàm đăng ký
  register: (data) => {
    const url = "/auth/register";
    return axiosClient.post(url, data);
  },

  // Hàm đăng nhập
  login: (data) => {
    const url = "/auth/login";
    return axiosClient.post(url, data);
  },

  // Hàm lấy thông tin profile (nếu cần sau này)
  getProfile: () => {
    const url = "/auth/me";
    return axiosClient.get(url);
  },
};

export default authApi;

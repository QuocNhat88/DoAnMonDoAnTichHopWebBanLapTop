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

  // Hàm lấy thông tin profile
  getProfile: () => {
    const url = "/auth/me";
    return axiosClient.get(url);
  },

  // 1. Cập nhật thông tin (Tên, SĐT, Địa chỉ)
  updateProfile: (data) => {
    return axiosClient.put("/auth/profile", data);
  },

  // 2. Đổi mật khẩu (Chủ động đổi trong Profile)
  changePassword: (data) => {
    return axiosClient.put("/auth/changepassword", data);
  },

  // --- THÊM 2 HÀM NÀY VÀO ---

  // 3. Quên mật khẩu (Gửi email)
  forgotPassword: (email) => {
    // Lưu ý: data gửi lên là object { email: "..." }
    return axiosClient.post("/auth/forgotpassword", { email });
  },

  // 4. Đặt lại mật khẩu (Từ link email)
  resetPassword: (token, password) => {
    // Dùng dấu huyền ` ` để truyền token vào URL
    return axiosClient.put(`/auth/resetpassword/${token}`, { password });
  },
};

export default authApi;

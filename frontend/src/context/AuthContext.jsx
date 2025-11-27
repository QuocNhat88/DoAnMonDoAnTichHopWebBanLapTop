// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo user: Kiểm tra xem trong localStorage có lưu user cũ không
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Hàm đăng nhập: Nhận data từ API -> Lưu vào State và localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token); // Lưu token để sau này gửi kèm request
  };

  // 3. Hàm đăng xuất: Xóa sạch
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems"); // Xóa giỏ hàng

    // Có thể thêm điều hướng về trang chủ ở đây nếu muốn
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "", // Backend bạn yêu cầu username
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng gõ vào ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Kiểm tra mật khẩu nhập lại có khớp không
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      // 2. Gọi API đăng ký
      // Lưu ý: Backend bạn cần username, email, password
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 3. Thành công -> Chuyển qua trang đăng nhập
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      // Lấy lỗi từ backend trả về (ví dụ: "Email đã tồn tại")
      setError(err.response?.data?.message || "Đăng ký thất bại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng Ký Tài Khoản
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="nguyenvana"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
          >
            ĐĂNG KÝ
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

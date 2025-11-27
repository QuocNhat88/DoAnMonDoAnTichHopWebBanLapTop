// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Để hiện lỗi nếu đăng nhập sai

  const { login } = useContext(AuthContext); // Lấy hàm login từ Context
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi login xong

  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn web load lại trang
    setError("");

    try {
      // 1. Gọi API backend
      const response = await authApi.login({ email, password });

      console.log("Kết quả login:", response);

      // 2. Lưu thông tin vào Context (Backend thường trả về: { user: {...}, token: "..." })
      // Bạn cần check console log xem backend trả về key tên là gì nhé
      login(response.user || response, response.token);

      // 3. Chuyển hướng về trang chủ
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.log("Lỗi login:", err);
      // Backend thường trả lỗi trong err.response.data.message
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng Nhập
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

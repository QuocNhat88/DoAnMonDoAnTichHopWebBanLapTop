// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../api/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Trong src/pages/ForgotPasswordPage.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    console.log("--- BẮT ĐẦU GỬI YÊU CẦU ---");
    console.log("Email gửi đi:", email);

    try {
      // 1. Thử gọi trực tiếp bằng fetch (Bỏ qua axios để test đường dẫn)
      // Đảm bảo đúng cổng 3000 và đúng đường dẫn /api/auth/forgotpassword
      const response = await fetch(
        "http://localhost:3000/api/auth/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      console.log("Trạng thái phản hồi:", response.status);

      const data = await response.json();
      console.log("Dữ liệu nhận được:", data);

      if (!response.ok) {
        throw new Error(data.message || "Lỗi từ Backend");
      }

      setMessage(data.message);
    } catch (err) {
      console.error("LỖI GẶP PHẢI:", err);
      // Nếu lỗi là "Failed to fetch" -> Backend chưa bật hoặc sai cổng
      setError(err.message || "Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Quên Mật Khẩu
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Nhập email đăng ký của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật
          khẩu.
        </p>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 mb-4 rounded text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              required
              className="w-full border px-4 py-2 rounded focus:outline-blue-500"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded font-bold transition
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            &larr; Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;

// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

function ResetPasswordPage() {
  const { token } = useParams(); // Lấy token từ URL (ví dụ: /resetpassword/abc123xyz...)
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      // Gọi API reset
      const res = await authApi.resetPassword(token, password);
      alert(res.message || "Đặt lại mật khẩu thành công!");
      // Thành công thì đá về trang đăng nhập
      navigate("/login");
    } catch (error) {
      alert(
        "Lỗi: " +
          (error.response?.data?.message || "Token hết hạn hoặc không hợp lệ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đặt Lại Mật Khẩu
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              required
              className="w-full border px-4 py-2 rounded focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              required
              className="w-full border px-4 py-2 rounded focus:outline-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded font-bold transition
              ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ResetPasswordPage;

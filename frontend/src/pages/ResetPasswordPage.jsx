// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, password);
      alert(
        res.message ||
          "🎉 Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.",
      );
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-br-full -ml-8 -mt-8 z-0"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Tạo mật khẩu mới
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Vui lòng nhập mật khẩu mới bảo mật hơn cho tài khoản của bạn.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu trên"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    ĐANG LƯU...
                  </>
                ) : (
                  "XÁC NHẬN ĐỔI MẬT KHẨU"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

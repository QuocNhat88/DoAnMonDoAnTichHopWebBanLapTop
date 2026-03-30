// src/layouts/AdminLayout.jsx
import React, { useContext, useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State mở/tắt sidebar trên mobile

  // --- 1. BẢO VỆ: CHỈ ADMIN MỚI ĐƯỢC Ở LẠI ---
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Đóng sidebar trên mobile mỗi khi chuyển trang
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  if (!user || user.role !== "admin") return null;

  // Hàm kiểm tra link đang active để tô màu
  const isActive = (path) =>
    location.pathname.includes(path)
      ? "bg-blue-600 text-white"
      : "text-gray-400 hover:bg-gray-800 hover:text-white";

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* LỚP MÀNG ĐEN (BACKDROP) CHO MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- 2. SIDEBAR BÊN TRÁI (MENU) --- */}
      {/* Mobile: Trượt ra/vào. PC: Luôn hiện */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header Sidebar */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-slate-950/50">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              ADMIN<span className="text-blue-500">PRO</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Hệ thống quản trị
            </p>
          </div>
          {/* Nút đóng sidebar trên mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
            Menu Chính
          </p>

          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("dashboard")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Tổng quan
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("orders")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Quản lý Đơn hàng
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("products")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Quản lý Sản phẩm
          </Link>

          <div className="pt-6 pb-2">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
              Dữ liệu tham chiếu
            </p>
          </div>

          <Link
            to="/admin/categories"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("categories")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Danh mục
          </Link>

          <Link
            to="/admin/brands"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("brands")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Thương hiệu
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-colors ${isActive("users")}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Tài khoản User
          </Link>
        </nav>

        {/* User Info & Đăng xuất */}
        <div className="p-4 border-t border-gray-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-inner border border-white/10">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm text-white truncate">
                {user.username}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="text-[11px] text-gray-400 font-medium">
                  Trực tuyến
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-colors"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* --- 3. NỘI DUNG CHÍNH BÊN PHẢI --- */}
      {/* PC: có ml-72 để chừa chỗ cho sidebar. Mobile: ml-0 */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex justify-between items-center px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Nút Hamburger (chỉ hiện trên mobile) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="hidden sm:block text-xl font-black text-gray-800 tracking-tight">
              Khu vực Quản trị
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-colors"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="hidden sm:inline">Xem Cửa hàng</span>
            </Link>
          </div>
        </header>

        {/* Nội dung các trang con (Sẽ tự scroll nếu nội dung dài) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

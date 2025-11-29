// src/layouts/AdminLayout.jsx
import React, { useContext, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. BẢO VỆ: CHỈ ADMIN MỚI ĐƯỢC Ở LẠI ---
  useEffect(() => {
    // Nếu chưa đăng nhập hoặc không phải admin -> Đá về trang chủ
    if (!user || user.role !== "admin") {
      // alert("Bạn không có quyền truy cập trang Quản trị!");
      navigate("/");
    }
  }, [user, navigate]);

  // Nếu không phải admin thì không hiển thị gì cả (tránh nháy giao diện)
  if (!user || user.role !== "admin") return null;

  // Hàm kiểm tra link đang active để tô màu
  const isActive = (path) =>
    location.pathname.includes(path) ? "bg-gray-700" : "";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- 2. SIDEBAR BÊN TRÁI (MENU) --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-lg fixed h-full">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">ADMIN PANEL</h1>
          <p className="text-xs text-gray-400 mt-1">Quản lý cửa hàng</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Link Dashboard (chưa làm thì cứ để đó) */}
          <Link
            to="/admin/dashboard"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "dashboard"
            )}`}
          >
            📊 Tổng quan
          </Link>

          {/* Link Sản phẩm (ĐANG LÀM) */}
          <Link
            to="/admin/products"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "products"
            )}`}
          >
            💻 Quản lý Sản phẩm
          </Link>

          {/* Link Đơn hàng */}
          <Link
            to="/admin/orders"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "orders"
            )}`}
          >
            📦 Quản lý Đơn hàng
          </Link>

          {/* Link Người dùng */}
          <Link
            to="/admin/users"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "users"
            )}`}
          >
            👥 Quản lý User
          </Link>
          <Link
            to="/admin/categories"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "categories"
            )}`}
          >
            📂 Quản lý Danh mục
          </Link>
          <Link
            to="/admin/brands"
            className={`block py-3 px-4 rounded hover:bg-gray-800 transition ${isActive(
              "brands"
            )}`}
          >
            🏷️ Quản lý Thương hiệu
          </Link>
        </nav>

        {/* Nút đăng xuất ở dưới cùng */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm truncate w-32">
                {user.username}
              </p>
              <p className="text-xs text-green-400">● Online</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full bg-red-600 py-2 rounded text-sm font-bold hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* --- 3. NỘI DUNG CHÍNH BÊN PHẢI --- */}
      {/* ml-64 để đẩy nội dung sang phải, tránh bị Sidebar che mất */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header nhỏ của Admin */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Hệ thống quản trị
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            &larr; Về trang chủ Website
          </Link>
        </header>

        {/* Khu vực hiển thị nội dung các trang con (AdminProductPage...) */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

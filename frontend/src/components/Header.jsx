// src/components/Header.jsx
import React, { useContext, useState } from "react"; // Thêm useState
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // --- LOGIC TÌM KIẾM MỚI ---
  const [keyword, setKeyword] = useState(""); // Lưu từ khóa
  const navigate = useNavigate(); // Dùng để chuyển trang

  const handleSearch = (e) => {
    e.preventDefault(); // Chặn load lại trang
    if (keyword.trim()) {
      // Chuyển hướng về trang chủ kèm theo từ khóa trên URL
      // Ví dụ: http://localhost:5173/?keyword=dell
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/"); // Nếu xóa trắng thì về trang chủ gốc
    }
  };
  // --------------------------

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LAPTOP STORE
        </Link>

        {/* --- FORM TÌM KIẾM ĐÃ SỬA --- */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-10">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:border-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700"
          >
            Tìm
          </button>
        </form>
        {/* --------------------------- */}

        <nav className="flex items-center gap-6">
          {/* ... (Phần menu giữ nguyên) ... */}
          <Link
            to="/cart"
            className="flex items-center text-gray-700 hover:text-blue-600 relative"
          >
            <span className="text-2xl mr-1">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="font-medium hidden sm:block">Giỏ hàng</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Sửa lại Link vào trang cá nhân */}
              <Link
                to="/profile"
                className="font-medium text-gray-800 hover:text-blue-600"
              >
                Hi, {user.fullName || user.username}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:underline"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

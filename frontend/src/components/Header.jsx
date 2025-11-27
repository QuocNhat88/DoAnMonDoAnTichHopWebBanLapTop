// src/components/Header.jsx
import { Link } from "react-router-dom";
import React, { useContext } from "react"; // 1. Import useContext
import { CartContext } from "../context/CartContext"; // 2. Import Context

function Header() {
  // 3. Móc dữ liệu cartItems từ "Két sắt" ra dùng
  const { cartItems } = useContext(CartContext);

  // Tính tổng số lượng sản phẩm (Ví dụ mua 2 cái A + 1 cái B = 3)
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LAPTOP STORE
        </Link>

        {/* (Phần thanh tìm kiếm giữ nguyên...) */}
        <div className="hidden md:flex flex-1 mx-10">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full border px-4 py-2 rounded-l-md"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-r-md">
            Tìm
          </button>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/cart"
            className="flex items-center text-gray-700 hover:text-blue-600 relative"
          >
            <span className="text-2xl mr-1">🛒</span>

            {/* 4. Hiển thị số lượng (Badge màu đỏ) */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}

            <span className="font-medium hidden sm:block">Giỏ hàng</span>
          </Link>

          <Link to="/login" className="font-medium hover:text-blue-600">
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

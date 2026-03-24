import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const [keyword, setKeyword] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State cho menu điện thoại
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
      setIsMobileMenuOpen(false); // Đóng menu mobile khi tìm kiếm xong
    } else {
      navigate("/");
    }
  };

  return (
    // Đổi shadow-md thành shadow-sm và thêm viền dưới cho tinh tế hơn
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- DÒNG 1: LOGO & NÚT MOBILE --- */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden sm:block">LAPTOP STORE</span>
          </Link>

          {/* Form tìm kiếm trên PC (Ẩn trên mobile) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8 relative"
          >
            <input
              type="text"
              placeholder="Bạn cần tìm laptop gì?"
              className="w-full bg-slate-100 text-slate-800 border-transparent rounded-full pl-5 pr-12 py-2.5 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 text-gray-500 hover:text-blue-600 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Các nút hành động bên phải */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Nút Giỏ hàng (Luôn hiện) */}
            <button
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Bạn cần đăng nhập để xem giỏ hàng!");
                  navigate("/login");
                } else {
                  navigate("/cart");
                }
              }}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Menu PC (Ẩn trên mobile) */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-500">Xin chào,</span>
                    <Link
                      to="/profile"
                      className="text-sm font-bold hover:text-blue-600 truncate max-w-[100px]"
                    >
                      {user.fullName || user.username}
                    </Link>
                  </div>

                  {user.role === "admin" && (
                    <Link
                      to="/admin/products"
                      className="text-xs font-bold text-red-600 hover:bg-red-50 bg-white border border-red-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Quản lý
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    className="text-sm font-medium text-slate-600 hover:text-blue-600"
                  >
                    Đơn hàng
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-slate-600 hover:text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 hover:text-blue-600"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-sm transition-all"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Nút Hamburger cho Mobile */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  /> // Icon X
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  /> // Icon Menu
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* --- DÒNG 2: MOBILE MENU (Chỉ hiện khi bấm Hamburger) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
            {/* Thanh tìm kiếm Mobile */}
            <form onSubmit={handleSearch} className="flex px-2">
              <input
                type="text"
                placeholder="Tìm laptop..."
                className="w-full bg-slate-100 text-slate-800 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
              >
                Tìm
              </button>
            </form>

            {/* Link Mobile */}
            <div className="flex flex-col gap-2 px-2">
              {user ? (
                <>
                  <div className="py-2 mb-2 border-b border-gray-100">
                    <span className="block text-xs text-slate-500">
                      Đang đăng nhập:
                    </span>
                    <Link
                      to="/profile"
                      className="font-bold text-lg text-slate-800"
                    >
                      {user.fullName || user.username}
                    </Link>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/products"
                      className="text-red-600 font-bold py-2"
                    >
                      Quản lý cửa hàng
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    className="text-slate-600 font-medium py-2"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-slate-600 font-medium py-2"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 font-medium py-2">
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-blue-600 font-medium py-2"
                  >
                    Đăng ký tài khoản
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

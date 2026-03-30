// src/components/Header.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hiệu ứng Glassmorphism khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
      setIsMobileMenuOpen(false);
    } else {
      navigate("/");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white border-b border-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- DÒNG 1: LOGO & NÚT MOBILE --- */}
        <div className="flex justify-between items-center h-[72px] gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-blue-600/20">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              LAPTOP<span className="text-blue-600">STORE</span>
            </span>
          </Link>

          {/* Form tìm kiếm trên PC */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
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
            </div>
            <input
              type="text"
              placeholder="Nhập tên laptop, dòng máy bạn cần tìm..."
              className="w-full bg-slate-100 text-slate-800 border border-transparent rounded-full pl-11 pr-24 py-2.5 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
            >
              Tìm
            </button>
          </form>

          {/* User & Cart Actions (PC) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Menu (PC Only) */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative group/menu py-4">
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Tài khoản
                      </span>
                      <span className="text-sm font-bold text-gray-900 truncate max-w-[120px] leading-tight group-hover/menu:text-blue-600 transition-colors">
                        {user.fullName || user.username}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover/menu:text-blue-500 transition-transform group-hover/menu:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-[60px] w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible translate-y-2 group-hover/menu:translate-y-0 transition-all duration-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 py-0.5 rounded text-center">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      {user.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
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
                          Trang quản trị
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
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
                        Đơn hàng của tôi
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-bold bg-gray-900 text-white hover:bg-blue-600 px-5 py-2.5 rounded-full transition-colors shadow-sm"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Giỏ hàng (Icon tròn nổi bật) */}
            <button
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Vui lòng đăng nhập để xem giỏ hàng!");
                  navigate("/login");
                } else {
                  navigate("/cart");
                }
              }}
              className="relative w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Nút Hamburger (Mobile) */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* --- DÒNG 2: MOBILE MENU (Trượt xuống mượt mà) --- */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100 border-t border-gray-100 py-4" : "max-h-0 opacity-0"}`}
        >
          <form onSubmit={handleSearch} className="flex relative mb-4">
            <input
              type="text"
              placeholder="Bạn cần tìm laptop gì?"
              className="w-full bg-slate-100 text-slate-800 rounded-xl pl-4 pr-20 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gray-900 text-white text-xs font-bold uppercase rounded-lg"
            >
              Tìm
            </button>
          </form>

          <div className="flex flex-col gap-1">
            {user ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center justify-between text-sm font-bold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      Khu vực Quản trị
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-between text-sm font-bold text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-left mt-2"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link
                  to="/login"
                  className="flex justify-center items-center py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex justify-center items-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-600/20"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

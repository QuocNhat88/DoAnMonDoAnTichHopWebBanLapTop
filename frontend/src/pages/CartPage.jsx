// src/pages/CartPage.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // --- TRẠNG THÁI GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Bạn chưa chọn sản phẩm nào. Hãy dạo một vòng và tìm chiếc laptop ưng
            ý nhé!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
          >
            Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN KHI CÓ HÀNG ---
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Giỏ hàng của bạn{" "}
            <span className="text-gray-400 text-lg md:text-xl font-medium">
              ({cartItems.length} sản phẩm)
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
          <div className="lg:col-span-8 space-y-4">
            {/* Thanh tiêu đề trên PC (Ẩn trên mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-3 text-right">Tạm tính</div>
            </div>

            {/* Danh sách các món hàng */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 sm:p-6 divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-4 sm:px-0 group"
                >
                  {/* Cột 1: Ảnh & Tên (Mobile: Full width, PC: 6 cols) */}
                  <div className="col-span-1 md:col-span-6 flex items-start sm:items-center gap-4">
                    <Link
                      to={`/products/${item._id}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-50 rounded-2xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      <img
                        src={
                          item.thumbnail || "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        to={`/products/${item._id}`}
                        className="font-bold text-gray-900 text-sm md:text-base hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm font-black text-red-600 md:hidden mb-2">
                        {item.price.toLocaleString("vi-VN")} ₫
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs font-semibold text-gray-400 hover:text-red-500 w-fit flex items-center gap-1 transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Cột 2: Số lượng (Mobile: Căn trái, PC: Căn giữa, 3 cols) */}
                  <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center mt-2 md:mt-0">
                    <div className="flex items-center bg-slate-100 rounded-full border border-gray-200 p-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
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
                            strokeWidth="2.5"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
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
                            strokeWidth="2.5"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Cột 3: Thành tiền (PC only, 3 cols) */}
                  <div className="hidden md:block col-span-3 text-right">
                    <p className="text-sm text-gray-400 line-through mb-0.5">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                    <p className="font-black text-lg text-red-600">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mt-4 pl-2"
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
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* --- CỘT PHẢI: TỔNG TIỀN --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-6">
                Thông tin đơn hàng
              </h2>

              <div className="space-y-4 text-sm font-medium text-gray-600 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                  <span className="text-gray-900 font-bold">
                    {totalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-bold">Tổng cộng:</span>
                <div className="text-right">
                  <span className="block text-2xl font-black text-red-600 leading-none">
                    {totalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                    (Đã bao gồm VAT nếu có)
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
              >
                Đặt hàng ngay
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

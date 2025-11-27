// src/pages/CartPage.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  // 1. Lấy dữ liệu và các hàm từ "Két sắt" Context
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // 2. Tính tổng tiền của cả giỏ hàng
  // reduce là hàm duyệt qua từng món, cộng dồn (giá * số lượng) vào biến total
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 3. Trường hợp giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg container mx-auto mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-8">
          Hãy dạo một vòng và chọn cho mình sản phẩm yêu thích nhé!
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          QUAY LẠI MUA SẮM
        </Link>
      </div>
    );
  }

  // 4. Giao diện khi có hàng
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Giỏ hàng của bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500 text-sm">
                <th className="pb-4">Sản phẩm</th>
                <th className="pb-4">Đơn giá</th>
                <th className="pb-4 text-center">Số lượng</th>
                <th className="pb-4 text-right">Thành tiền</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  {/* Cột 1: Ảnh & Tên */}
                  <td className="py-4 flex items-center gap-4">
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded bg-gray-100"
                    />
                    <div>
                      <Link
                        to={`/products/${item._id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        Mã: {item._id.slice(-6)}
                      </span>
                    </div>
                  </td>

                  {/* Cột 2: Giá gốc */}
                  <td className="py-4 font-medium text-gray-700">
                    {item.price.toLocaleString("vi-VN")} đ
                  </td>

                  {/* Cột 3: Tăng giảm số lượng */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Cột 4: Thành tiền (Giá x Số lượng) */}
                  <td className="py-4 text-right font-bold text-gray-800">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </td>

                  {/* Cột 5: Nút xóa */}
                  <td className="py-4 text-right">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Xóa khỏi giỏ"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- CỘT PHẢI: TỔNG TIỀN --- */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">
            Cộng giỏ hàng
          </h2>

          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-bold">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex justify-between mb-8">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="text-green-600 font-medium">Miễn phí</span>
          </div>

          <div className="flex justify-between mb-8 text-xl font-bold text-red-600 border-t pt-4">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>

          {/* Link sang trang Thanh toán (Checkout) - Sẽ làm sau */}
          <Link
            to="/checkout"
            className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-bold hover:bg-red-700 transition uppercase"
          >
            Tiến hành thanh toán
          </Link>

          <Link
            to="/"
            className="block w-full text-center mt-4 text-blue-600 hover:underline"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

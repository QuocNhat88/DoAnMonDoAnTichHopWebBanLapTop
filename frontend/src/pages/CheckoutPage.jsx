// src/pages/CheckoutPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import Context và API
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import orderApi from "../api/orderApi";

function CheckoutPage() {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State quản lý loading
  const [isProcessing, setIsProcessing] = useState(false);

  // State lưu thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  // Tự động điền tên nếu user đã đăng nhập
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: user.fullName || user.username || "",
      }));
    } else {
      // Nếu chưa đăng nhập thì đá về trang login
      const timer = setTimeout(() => {
        alert("Bạn cần đăng nhập để thanh toán!");
        navigate("/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // --- HÀM XỬ LÝ ĐẶT HÀNG (ĐÃ SỬA: KHÔNG ĐỒNG BỘ LẠI NỮA) ---
  const handleOrder = async (e) => {
    e.preventDefault();

    // Nếu đang xử lý thì không cho bấm tiếp
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // BƯỚC 1: CHUẨN BỊ DỮ LIỆU
      // Không cần gửi danh sách sản phẩm lên nữa, Backend tự lấy trong giỏ hàng Database
      const orderData = {
        shippingInfo: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          phoneNumber: shippingInfo.phoneNumber,
        },
        paymentMethod: "cod", // Thanh toán khi nhận hàng
        itemsPrice: calculateTotal(),
        shippingPrice: 0,
        totalPrice: calculateTotal(),
      };

      // BƯỚC 2: GỌI API ĐẶT HÀNG
      console.log("Đang gửi đơn hàng...", orderData);
      await orderApi.createOrder(orderData);

      // BƯỚC 3: THÀNH CÔNG
      alert("Đặt hàng thành công! Cảm ơn bạn đã ủng hộ.");

      // Load lại trang về trang chủ (Backend đã tự xóa giỏ hàng sau khi đặt thành công)
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      const message =
        error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.";
      alert(message);
    } finally {
      setIsProcessing(false); // Tắt loading
    }
  };

  // Nếu giỏ hàng trống thì không hiện form
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống!</h2>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:underline"
        >
          Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Thanh Toán
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- CỘT TRÁI: FORM THÔNG TIN --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Thông tin giao hàng
          </h2>
          <form onSubmit={handleOrder}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Họ và tên
              </label>
              <input
                required
                type="text"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                value={shippingInfo.fullName}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                }
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Số điện thoại
              </label>
              <input
                required
                type="text"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                value={shippingInfo.phoneNumber}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    phoneNumber: e.target.value,
                  })
                }
                placeholder="0909xxxxxx"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Địa chỉ nhận hàng
              </label>
              <textarea
                required
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                rows="3"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                placeholder="Số nhà, đường, phường/xã..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full text-white py-3 rounded-lg font-bold transition uppercase
                ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }
              `}
            >
              {isProcessing
                ? "Đang xử lý..."
                : `ĐẶT HÀNG NGAY (${calculateTotal().toLocaleString(
                    "vi-VN"
                  )} đ)`}
            </button>
          </form>
        </div>

        {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit border border-gray-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Đơn hàng của bạn
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border rounded bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/64"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm line-clamp-2 w-40">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Số lượng: x{item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-gray-800">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Tạm tính:</span>
              <span>{calculateTotal().toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-red-600">
              <span>Tổng cộng:</span>
              <span>{calculateTotal().toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

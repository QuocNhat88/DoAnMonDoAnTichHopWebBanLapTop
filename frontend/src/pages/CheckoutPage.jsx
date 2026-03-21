import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import Context và API
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import orderApi from "../api/orderApi";

function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext); // Giả sử bạn có hàm clearCart trong Context, nếu không có thì bỏ qua
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

  // State quản lý thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' hoặc 'banking'
  const [orderSuccessData, setOrderSuccessData] = useState(null); // Lưu data đơn hàng sau khi tạo xong

  // --- CẤU HÌNH TÀI KHOẢN NGÂN HÀNG (SỬA LẠI CHO ĐÚNG CỦA BẠN) ---
  const BANK_INFO = {
    BANK_ID: "BIDV", // Mã ngân hàng (MB, VCB, ACB, VPB, TPB,...)
    ACCOUNT_NO: "V3CASSLAPTOPDEPTRAI", // Số tài khoản nhận tiền
    TEMPLATE: "compact", // Kiểu QR
    ACCOUNT_NAME: "NGUYEN VAN QUOC NHAT", // Tên chủ tài khoản
  };

  // Tự động điền tên nếu user đã đăng nhập
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: user.fullName || user.username || "",
      }));
    } else {
      const timer = setTimeout(() => {
        alert("Bạn cần đăng nhập để thanh toán!");
        navigate("/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // --- LOGIC MỚI: TỰ ĐỘNG KIỂM TRA THANH TOÁN (POLLING) ---
  useEffect(() => {
    let intervalId;

    // Chỉ chạy khi đã có đơn hàng Banking đang chờ
    if (orderSuccessData && paymentMethod === "banking") {
      const checkStatus = async () => {
        try {
          // Gọi API lấy thông tin đơn hàng mới nhất
          const response = await orderApi.getOrderById(orderSuccessData._id);
          // Tùy vào cấu trúc axiosClient của bạn trả về data hay response.data
          // Thông thường là response.data
          const order = response.data;

          // Kiểm tra xem đơn đã thanh toán chưa
          if (order && order.isPaid) {
            clearInterval(intervalId); // Dừng kiểm tra
            alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");

            // Nếu có hàm xóa giỏ hàng ở Context thì gọi ở đây
            // if (clearCart) clearCart();

            // Chuyển hướng về trang chủ
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra thanh toán:", error);
        }
      };

      // Cứ 3 giây gọi API 1 lần
      intervalId = setInterval(checkStatus, 3000);
    }

    // Dọn dẹp khi component bị hủy
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderSuccessData, paymentMethod]);

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  // Xử lý đặt hàng
  const handleOrder = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const orderData = {
        shippingInfo,
        paymentMethod: paymentMethod,
        itemsPrice: calculateTotal(),
        shippingPrice: 0,
        totalPrice: calculateTotal(),
      };

      console.log("Đang gửi đơn hàng...", orderData);
      const response = await orderApi.createOrder(orderData);

      // Kiểm tra phản hồi (Tùy cấu trúc trả về của API)
      const newOrder = response.data || response;

      if (response.success || newOrder) {
        if (paymentMethod === "cod") {
          alert("Đặt hàng thành công! Cảm ơn bạn.");
          window.location.href = "/";
        } else {
          // Nếu là Banking -> Lưu thông tin đơn để hiện QR
          // newOrder phải chứa _id của đơn hàng
          setOrderSuccessData(newOrder);
        }
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- GIAO DIỆN KHI HIỆN MÃ QR ---
  if (orderSuccessData && paymentMethod === "banking") {
    // Link tạo mã QR VietQR
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${
      BANK_INFO.ACCOUNT_NO
    }-${BANK_INFO.TEMPLATE}.png?amount=${orderSuccessData.totalPrice}&addInfo=${
      orderSuccessData._id
    }&accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`;

    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto border-2 border-green-500">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Đặt hàng thành công!
          </h2>
          <p className="mb-6 text-gray-700">
            Vui lòng quét mã QR bên dưới để hoàn tất thanh toán.
          </p>

          <div className="flex justify-center mb-6">
            <img
              src={qrUrl}
              alt="VietQR"
              className="border rounded-lg shadow-sm max-w-[300px]"
            />
          </div>

          <div className="text-left bg-gray-50 p-4 rounded text-sm mb-6 space-y-2">
            <p>
              <strong>Ngân hàng:</strong> {BANK_INFO.BANK_ID}
            </p>
            <p>
              <strong>Số tài khoản:</strong> {BANK_INFO.ACCOUNT_NO}
            </p>
            <p>
              <strong>Chủ tài khoản:</strong> {BANK_INFO.ACCOUNT_NAME}
            </p>
            <p>
              <strong>Số tiền:</strong>{" "}
              <span className="text-lg font-bold text-red-600">
                {orderSuccessData.totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </p>
            <p>
              <strong>Nội dung CK:</strong>{" "}
              <span className="text-blue-600 font-bold bg-blue-100 px-2 py-1 rounded">
                {orderSuccessData._id}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 italic mb-6">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang chờ thanh toán...</span>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="text-blue-600 hover:underline text-sm"
          >
            Thanh toán sau / Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Nếu giỏ hàng trống (Chỉ hiện khi chưa đặt hàng xong)
  if ((!cartItems || cartItems.length === 0) && !orderSuccessData) {
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

  // --- GIAO DIỆN FORM ĐẶT HÀNG CHÍNH ---
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Thanh Toán
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
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

            {/* PHẦN CHỌN THANH TOÁN */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3 font-medium">
                Phương thức thanh toán
              </label>
              <div className="flex flex-col gap-3">
                {/* Option 1: COD */}
                <label
                  className={`flex items-center p-4 border rounded cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mr-3 w-5 h-5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold block text-gray-800">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-sm text-gray-500">
                      Thanh toán tiền mặt cho shipper khi nhận hàng.
                    </span>
                  </div>
                </label>

                {/* Option 2: Banking */}
                <label
                  className={`flex items-center p-4 border rounded cursor-pointer transition ${
                    paymentMethod === "banking"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={paymentMethod === "banking"}
                    onChange={() => setPaymentMethod("banking")}
                    className="mr-3 w-5 h-5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold block text-gray-800">
                      Chuyển khoản Ngân hàng (VietQR)
                    </span>
                    <span className="text-sm text-gray-500">
                      Quét mã QR để thanh toán tự động 24/7.
                    </span>
                  </div>
                </label>
              </div>
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
                    "vi-VN",
                  )} đ)`}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
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

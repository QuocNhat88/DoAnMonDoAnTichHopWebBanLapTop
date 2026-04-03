import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Import Context và API
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import orderApi from "../api/orderApi";

function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' hoặc 'banking'
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // --- CẤU HÌNH TÀI KHOẢN NGÂN HÀNG ---
  const BANK_INFO = {
    BANK_ID: "BIDV",
    ACCOUNT_NO: "V3CASSLAPTOPMODULAR",
    TEMPLATE: "compact",
    ACCOUNT_NAME: "NGUYEN VAN QUOC NHAT",
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

  // --- LOGIC TỰ ĐỘNG KIỂM TRA THANH TOÁN (POLLING) ---
  useEffect(() => {
    let intervalId;
    if (orderSuccessData && paymentMethod === "banking") {
      const checkStatus = async () => {
        try {
          const response = await orderApi.getOrderById(orderSuccessData._id);
          const order = response.data;
          if (order && order.isPaid) {
            clearInterval(intervalId);
            alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
            // if (clearCart) clearCart();
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra thanh toán:", error);
        }
      };
      intervalId = setInterval(checkStatus, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderSuccessData, paymentMethod]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(shippingInfo.phoneNumber)) {
      alert(
        "Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số và bắt đầu bằng số 0.",
      );
      return;
    }
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

      const response = await orderApi.createOrder(orderData);
      const newOrder = response.data || response;

      if (response.success || newOrder) {
        if (paymentMethod === "cod") {
          alert("🎉 Đặt hàng thành công! Đơn hàng sẽ sớm được giao đến bạn.");
          // if (clearCart) clearCart();
          window.location.href = "/";
        } else {
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

  // --- GIAO DIỆN KHI HIỆN MÃ QR (THANH TOÁN BANKING) ---
  if (orderSuccessData && paymentMethod === "banking") {
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${BANK_INFO.ACCOUNT_NO}-${BANK_INFO.TEMPLATE}.png?amount=${orderSuccessData.totalPrice}&addInfo=${orderSuccessData._id}&accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`;

    return (
      <div className="min-h-[80vh] bg-slate-50 py-12 px-4 flex justify-center items-center">
        <div className="bg-white max-w-md w-full rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 relative">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
            <h2 className="text-xl font-black mb-1">Thanh toán Đơn hàng</h2>
            <p className="text-blue-100 text-sm font-medium">
              Mã đơn: #{orderSuccessData._id.slice(-6).toUpperCase()}
            </p>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-center text-sm text-gray-500 font-medium mb-6">
              Mở App Ngân hàng bất kỳ để quét mã QR
            </p>

            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl animate-pulse"></div>
              <img
                src={qrUrl}
                alt="VietQR"
                className="relative z-10 border border-gray-200 rounded-2xl shadow-sm w-56 h-56 object-contain bg-white p-2"
              />
            </div>

            <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-sm space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-bold text-gray-900">
                  {BANK_INFO.BANK_ID}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-bold text-gray-900 tracking-wider">
                  {BANK_INFO.ACCOUNT_NO}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <span className="font-bold text-gray-900">
                  {BANK_INFO.ACCOUNT_NAME}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-500">Số tiền:</span>
                <span className="text-lg font-black text-blue-600">
                  {orderSuccessData.totalPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Nội dung CK:</span>
                <span className="font-bold text-gray-900 bg-gray-200 px-2 py-0.5 rounded">
                  {orderSuccessData._id}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-medium text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Hệ thống đang chờ nhận tiền...
              </div>
              <button
                onClick={() => (window.location.href = "/")}
                className="text-gray-400 hover:text-gray-600 hover:underline text-sm font-medium mt-2"
              >
                Tôi sẽ thanh toán sau
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TRẠNG THÁI GIỎ HÀNG TRỐNG ---
  if ((!cartItems || cartItems.length === 0) && !orderSuccessData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-500 mb-6">
          Bạn cần chọn sản phẩm trước khi thanh toán.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  // --- GIAO DIỆN FORM ĐẶT HÀNG CHÍNH ---
  return (
    <div className="bg-slate-50 min-h-screen pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-8">
          <Link to="/cart" className="hover:text-blue-600 transition-colors">
            Giỏ hàng
          </Link>
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
          <span className="text-gray-900 font-bold">Thanh toán</span>
        </div>

        <form
          onSubmit={handleOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* CỘT TRÁI: FORM NHẬP LIỆU */}
          <div className="lg:col-span-7 space-y-8">
            {/* Box 1: Thông tin người nhận */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                  1
                </span>
                Thông tin nhận hàng
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={shippingInfo.phoneNumber}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="090xxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Địa chỉ giao hàng cụ thể{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none custom-scrollbar"
                    rows="3"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Box 2: Phương thức thanh toán */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                  2
                </span>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option COD */}
                <label
                  className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-white hover:border-blue-300"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    className="peer sr-only"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "cod" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
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
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-blue-600" : "border-gray-300"}`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 block mb-1">
                    Tiền mặt (COD)
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Thanh toán cho shipper khi nhận được hàng.
                  </span>
                </label>

                {/* Option Banking */}
                <label
                  className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${paymentMethod === "banking" ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-white hover:border-blue-300"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    className="peer sr-only"
                    checked={paymentMethod === "banking"}
                    onChange={() => setPaymentMethod("banking")}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "banking" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "banking" ? "border-blue-600" : "border-gray-300"}`}
                    >
                      {paymentMethod === "banking" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 block mb-1">
                    Chuyển khoản (QR)
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Quét mã QR để thanh toán tự động nhanh chóng.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                Đơn hàng của bạn
              </h2>

              {/* Product List */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0 relative">
                      <img
                        src={item.thumbnail || "https://via.placeholder.com/64"}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mb-1">
                        {item.name}
                      </p>
                      <p className="text-sm font-black text-blue-600">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="border-t border-gray-100 pt-5 space-y-3 mb-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="text-gray-900">
                    {calculateTotal().toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-5 border-t border-gray-100">
                <span className="text-gray-900 font-bold">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-black text-red-600 leading-none">
                  {calculateTotal().toLocaleString("vi-VN")} ₫
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>ĐẶT HÀNG NGAY</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;

// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderApi from "../api/orderApi";

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const BANK_ID = "BIDV";
  const ACCOUNT_NO = "V3CASSLAPTOPMODULAR";
  const ACCOUNT_NAME = "NGUYEN VAN QUOC NHAT";
  const TEMPLATE = "compact";

  const fetchOrderDetail = async () => {
    try {
      const response = await orderApi.getOrderById(id);
      setOrder(response.data || response);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  useEffect(() => {
    let intervalId;
    if (
      order &&
      !order.isPaid &&
      order.status !== "cancelled" &&
      order.paymentMethod === "banking"
    ) {
      intervalId = setInterval(async () => {
        try {
          const res = await orderApi.getOrderById(id);
          const updatedData = res.data || res;
          if (updatedData.isPaid) {
            setOrder(updatedData);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Lỗi polling:", error);
        }
      }, 5000); // Check mỗi 5 giây
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [order, id]);

  const handleCancelOrder = async () => {
    if (
      !window.confirm(
        "⚠️ Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      )
    )
      return;
    try {
      await orderApi.cancelOrder(id);
      alert("Đã hủy đơn hàng thành công!");
      fetchOrderDetail();
    } catch (error) {
      alert(error.response?.data?.message || "Hủy đơn thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy đơn hàng
        </h2>
        <Link
          to="/my-orders"
          className="text-blue-600 hover:underline font-medium"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${order.totalPrice}&addInfo=${order._id}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Logic cho Progress Bar
  const statusSteps = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6"
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
        Quay lại đơn hàng
      </Link>

      {/* HEADER & TRẠNG THÁI */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              Chi tiết đơn hàng{" "}
              <span className="text-blue-600 font-mono text-lg ml-2">
                #{order._id.slice(-6).toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {order.isPaid ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-bold">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Đã thanh toán
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm font-bold">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Chưa thanh toán
              </span>
            )}

            {order.status === "pending" && !order.isPaid && (
              <button
                onClick={handleCancelOrder}
                className="text-sm font-bold text-red-500 hover:text-white bg-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-1.5 rounded-lg transition-colors"
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS BAR TRẠNG THÁI GIAO HÀNG */}
        {!isCancelled ? (
          <div className="relative pt-4 pb-2">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
              <div
                style={{
                  width: `${(Math.max(currentStepIndex, 0) / 3) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
              <span className={currentStepIndex >= 0 ? "text-blue-600" : ""}>
                Chờ xử lý
              </span>
              <span
                className={
                  currentStepIndex >= 1
                    ? "text-blue-600 text-center"
                    : "text-center"
                }
              >
                Đóng gói
              </span>
              <span
                className={
                  currentStepIndex >= 2
                    ? "text-blue-600 text-center"
                    : "text-center"
                }
              >
                Vận chuyển
              </span>
              <span
                className={
                  currentStepIndex >= 3
                    ? "text-emerald-600 text-right"
                    : "text-right"
                }
              >
                Hoàn thành
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 font-bold">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Đơn hàng đã bị hủy
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: THÔNG TIN SẢN PHẨM & GIAO HÀNG */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Địa chỉ nhận hàng
            </h3>
            <div className="bg-slate-50 rounded-2xl p-5 border border-gray-100 space-y-2">
              <p className="text-gray-900 font-bold">
                {order.shippingInfo.fullName}
              </p>
              <p className="text-gray-600 text-sm">
                SĐT:{" "}
                <span className="font-medium text-gray-900">
                  {order.shippingInfo.phoneNumber}
                </span>
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {order.shippingInfo.address}
              </p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
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
              Sản phẩm đã mua
            </h3>
            <div className="space-y-4 divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex gap-4 pt-4 first:pt-0">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl border border-gray-100 p-2 flex-shrink-0">
                    <img
                      src={
                        item.product?.thumbnail ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <Link
                      to={`/products/${item.product?._id}`}
                      className="font-bold text-gray-900 hover:text-blue-600 text-sm md:text-base line-clamp-2 leading-snug mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-medium text-gray-500">
                      Số lượng:{" "}
                      <span className="text-gray-900">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="flex items-center font-black text-gray-900">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THANH TOÁN & QR */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
            <h3 className="text-lg font-black text-gray-900 mb-6">
              Thanh toán
            </h3>

            <div className="space-y-3 pb-5 border-b border-gray-100 mb-5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Phương thức</span>
                <span className="font-bold text-gray-900 text-right">
                  {order.paymentMethod === "cod"
                    ? "Tiền mặt (COD)"
                    : "Chuyển khoản (QR)"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">
                  {order.totalPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-emerald-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-gray-900">Tổng cộng</span>
              <span className="text-2xl font-black text-red-600">
                {order.totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {/* VÙNG MÃ QR (Chỉ hiện khi banking + chưa trả + chưa hủy) */}
            {!order.isPaid &&
              order.paymentMethod === "banking" &&
              !isCancelled && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-gray-200 mt-6 relative overflow-hidden">
                  {/* Hiệu ứng radar quét (Giả lập bằng CSS gradient) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400/0 via-blue-400/20 to-blue-400/0 w-full h-full animate-[scan_2s_ease-in-out_infinite] opacity-50 z-0"></div>

                  <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 relative z-10">
                    Quét mã để thanh toán
                  </p>
                  <div className="bg-white p-2 rounded-xl shadow-sm w-fit mx-auto relative z-10 border border-gray-100">
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>

                  <div className="mt-5 space-y-1 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 relative z-10">
                    <div className="flex justify-between">
                      <span className="text-gray-400">NH:</span>{" "}
                      <span className="font-bold text-gray-900">{BANK_ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">STK:</span>{" "}
                      <span className="font-bold text-gray-900">
                        {ACCOUNT_NO}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nội dung:</span>{" "}
                      <span className="font-bold text-blue-600">
                        {order._id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-bold text-blue-500 relative z-10">
                    <svg
                      className="animate-spin h-3.5 w-3.5"
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
                    ĐANG CHỜ HỆ THỐNG XÁC NHẬN
                  </div>

                  {/* Định nghĩa CSS keyframe cho hiệu ứng radar ngay trong JSX */}
                  <style>{`
                  @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                  }
                `}</style>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;

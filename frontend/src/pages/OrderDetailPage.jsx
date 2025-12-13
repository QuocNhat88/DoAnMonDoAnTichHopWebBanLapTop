// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderApi from "../api/orderApi";

function OrderDetailPage() {
  const { id } = useParams(); // Lấy ID từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- CẤU HÌNH TÀI KHOẢN NGÂN HÀNG (Thay bằng thông tin của bạn) ---
  const BANK_ID = "MB";
  const ACCOUNT_NO = "11226666888999";
  const ACCOUNT_NAME = "NGUYEN VAN QUOC NHAT";
  const TEMPLATE = "compact"; // compact, print, qr_only

  // Hàm tải dữ liệu đơn hàng (Chạy lần đầu)
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

  // --- HÀM POLLING: TỰ ĐỘNG CHECK THANH TOÁN (MỚI) ---
  useEffect(() => {
    let intervalId;

    // Chỉ chạy khi: Đã có đơn hàng + Chưa thanh toán + Không bị hủy
    if (order && !order.isPaid && order.status !== "cancelled") {
      console.log("Đang chờ thanh toán... (Auto check mỗi 3s)");

      intervalId = setInterval(async () => {
        try {
          // Gọi API kiểm tra âm thầm
          const res = await orderApi.getOrderById(id);
          const updatedData = res.data || res;

          // Nếu phát hiện đã thanh toán (isPaid = true)
          if (updatedData.isPaid) {
            setOrder(updatedData); // Cập nhật lại state
            alert("Thanh toán thành công! Cảm ơn quý khách.");
            clearInterval(intervalId); // Dừng check ngay lập tức
          }
        } catch (error) {
          console.error("Lỗi polling:", error);
        }
      }, 3000); // 3000ms = 3 giây
    }

    // Dọn dẹp interval khi rời trang hoặc đơn hàng đã cập nhật xong
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [order, id]); // Chạy lại mỗi khi state 'order' thay đổi

  // Hàm xử lý Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?"))
      return;

    try {
      await orderApi.cancelOrder(id);
      alert("Đã hủy đơn hàng thành công!");
      fetchOrderDetail(); // Tải lại dữ liệu
    } catch (error) {
      alert(error.response?.data?.message || "Hủy đơn thất bại");
    }
  };

  if (loading) return <div className="text-center mt-20">Đang tải...</div>;
  if (!order)
    return <div className="text-center mt-20">Không tìm thấy đơn hàng</div>;

  // Link tạo mã QR tự động (VietQR)
  // Lưu ý: addInfo phải là ID đơn hàng để Webhook backend nhận diện được
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${order.totalPrice}&addInfo=${order._id}&accountName=${ACCOUNT_NAME}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/my-orders"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Quay lại danh sách
      </Link>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header Đơn hàng */}
        <div className="flex justify-between items-center border-b pb-4 mb-4 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-sm text-gray-500">Mã đơn: #{order._id}</p>
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="text-right">
            {/* Badge Trạng thái */}
            <span
              className={`px-4 py-2 rounded-full font-bold text-sm uppercase inline-block
                ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
            >
              {order.status === "pending"
                ? "Chờ xử lý"
                : order.status === "cancelled"
                ? "Đã hủy"
                : order.status === "delivered"
                ? "Giao thành công"
                : order.status}
            </span>

            {/* Trạng thái thanh toán */}
            <div className="mt-2 font-semibold">
              {order.isPaid ? (
                <span className="text-green-600">✔ Đã thanh toán</span>
              ) : (
                <span className="text-red-500">✘ Chưa thanh toán</span>
              )}
            </div>

            {/* Nút hủy đơn */}
            {order.status === "pending" && !order.isPaid && (
              <button
                onClick={handleCancelOrder}
                className="block mt-2 text-sm text-red-600 hover:underline ml-auto"
              >
                Hủy đơn hàng này
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột Trái: Thông tin người nhận */}
          <div>
            <h3 className="font-bold text-lg mb-2">Địa chỉ nhận hàng</h3>
            <div className="text-gray-700 bg-gray-50 p-4 rounded mb-6">
              <p>
                <span className="font-semibold">Người nhận:</span>{" "}
                {order.shippingInfo.fullName}
              </p>
              <p>
                <span className="font-semibold">SĐT:</span>{" "}
                {order.shippingInfo.phoneNumber}
              </p>
              <p>
                <span className="font-semibold">Địa chỉ:</span>{" "}
                {order.shippingInfo.address}
              </p>
            </div>

            <h3 className="font-bold text-lg mb-2">Sản phẩm đã mua</h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.product?.thumbnail ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded bg-gray-100"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product?._id}`}
                        className="font-medium text-gray-800 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold text-gray-800">
                    {item.price.toLocaleString("vi-VN")} đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Thông tin thanh toán & QR Code */}
          <div>
            <h3 className="font-bold text-lg mb-2">Thông tin thanh toán</h3>
            <div className="text-gray-700 bg-gray-50 p-4 rounded border border-gray-200">
              <p className="mb-2">
                <span className="font-semibold">Phương thức:</span>{" "}
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Chuyển khoản ngân hàng (Banking)"}
              </p>
              <p className="text-xl mb-4">
                <span className="font-semibold text-red-600">Tổng tiền:</span>{" "}
                <span className="font-bold text-red-600">
                  {order.totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </p>

              {/* LOGIC HIỂN THỊ MÃ QR */}
              {/* Chỉ hiện QR khi: Phương thức là banking + Chưa thanh toán + Chưa hủy */}
              {!order.isPaid &&
                order.paymentMethod !== "cod" &&
                order.status !== "cancelled" && (
                  <div className="mt-4 text-center border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Quét mã QR để thanh toán tự động:
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={qrUrl}
                        alt="Mã QR Thanh Toán"
                        className="w-full max-w-xs border rounded-lg shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Hệ thống sẽ tự động cập nhật sau vài giây khi bạn chuyển
                      khoản thành công.
                    </p>
                  </div>
                )}

              {/* Nếu đã thanh toán */}
              {order.isPaid && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded text-center text-green-700 font-semibold">
                  Đơn hàng đã được thanh toán thành công!
                  {order.paidAt && (
                    <div className="text-xs font-normal text-green-600 mt-1">
                      Thời gian:{" "}
                      {new Date(order.paidAt).toLocaleString("vi-VN")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;

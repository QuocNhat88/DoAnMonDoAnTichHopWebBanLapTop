// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderApi from "../api/orderApi";

function OrderDetailPage() {
  const { id } = useParams(); // Lấy ID từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm tải dữ liệu đơn hàng
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

  // Hàm xử lý Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?"))
      return;

    try {
      await orderApi.cancelOrder(id);
      alert("Đã hủy đơn hàng thành công!");
      // Tải lại dữ liệu để cập nhật trạng thái mới
      fetchOrderDetail();
    } catch (error) {
      alert(error.response?.data?.message || "Hủy đơn thất bại");
    }
  };

  if (loading) return <div className="text-center mt-20">Đang tải...</div>;
  if (!order)
    return <div className="text-center mt-20">Không tìm thấy đơn hàng</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/my-orders"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Quay lại danh sách
      </Link>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <p className="text-sm text-gray-500">Mã đơn: #{order._id}</p>
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Trạng thái đơn hàng */}
          <div className="text-right">
            <span
              className={`px-4 py-2 rounded-full font-bold text-sm uppercase
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

            {/* Nút hủy đơn (Chỉ hiện khi trạng thái là pending) */}
            {order.status === "pending" && (
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
          {/* Thông tin người nhận */}
          <div>
            <h3 className="font-bold text-lg mb-2">Địa chỉ nhận hàng</h3>
            <div className="text-gray-700 bg-gray-50 p-4 rounded">
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
          </div>

          {/* Thông tin thanh toán */}
          <div>
            <h3 className="font-bold text-lg mb-2">Thanh toán</h3>
            <div className="text-gray-700 bg-gray-50 p-4 rounded">
              <p>
                <span className="font-semibold">Phương thức:</span> Thanh toán
                khi nhận hàng (COD)
              </p>
              <p>
                <span className="font-semibold text-red-600">Tổng tiền:</span>{" "}
                {order.totalPrice.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Sản phẩm đã mua</h3>
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
                    {/* Link quay lại trang sản phẩm nếu muốn mua lại */}
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
      </div>
    </div>
  );
}

export default OrderDetailPage;

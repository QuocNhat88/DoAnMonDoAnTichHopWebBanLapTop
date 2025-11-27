// src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderApi from "../api/orderApi";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getMyOrders();
        console.log("Danh sách đơn hàng:", response);
        // Backend trả về: { success: true, count: 2, data: [...] }
        setOrders(response.data || []);
      } catch (error) {
        console.log("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Hàm tô màu cho trạng thái đơn hàng
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"; // Chờ xử lý
      case "processing":
        return "bg-blue-100 text-blue-800"; // Đang xử lý
      case "shipped":
        return "bg-indigo-100 text-indigo-800"; // Đang giao
      case "delivered":
        return "bg-green-100 text-green-800"; // Đã giao
      case "cancelled":
        return "bg-red-100 text-red-800"; // Đã hủy
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Dịch trạng thái sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang vận chuyển";
      case "delivered":
        return "Giao thành công";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading)
    return <div className="text-center mt-20">Đang tải đơn hàng...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="text-center bg-gray-50 p-10 rounded-lg">
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link to="/" className="text-blue-600 hover:underline font-bold">
            Đi mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-4 px-6">Mã đơn hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-blue-600">
                    #{order._id.slice(-6).toUpperCase()}{" "}
                    {/* Lấy 6 ký tự cuối cho gọn */}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800">
                    {order.totalPrice?.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;

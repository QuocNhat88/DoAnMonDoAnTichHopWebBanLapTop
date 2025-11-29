// src/pages/admin/AdminOrderPage.jsx
import React, { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import { Link } from "react-router-dom";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders();
      // Backend trả về: { success: true, count: ..., data: [...] }
      setOrders(response.data || []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm xử lý đổi trạng thái
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      alert("Cập nhật trạng thái thành công!");
      // Gọi lại API để cập nhật dữ liệu mới nhất
      fetchOrders();
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Màu sắc cho từng trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải danh sách đơn...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Đơn hàng
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm uppercase text-gray-600">
              <th className="p-4">Mã Đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-mono text-blue-600">
                  <Link to={`/order/${order._id}`} title="Xem chi tiết">
                    #{order._id.slice(-6).toUpperCase()}
                  </Link>
                </td>
                <td className="p-4">
                  <p className="font-bold">{order.shippingInfo?.fullName}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {order.totalPrice?.toLocaleString()} đ
                </td>
                <td className="p-4">
                  {/* Select box để đổi trạng thái nhanh */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`border px-3 py-1 rounded text-xs font-bold uppercase cursor-pointer focus:outline-none ${getStatusColor(
                      order.status
                    )}`}
                    disabled={
                      order.status === "cancelled" ||
                      order.status === "delivered"
                    }
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    Xem Chi Tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Chưa có đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderPage;

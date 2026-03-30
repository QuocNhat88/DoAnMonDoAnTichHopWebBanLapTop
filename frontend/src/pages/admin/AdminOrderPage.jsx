// src/pages/admin/AdminOrderPage.jsx
import React, { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import { Link } from "react-router-dom";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders();
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100";
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200 hover:bg-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi, duyệt và cập nhật trạng thái giao hàng.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-gray-50 shadow-sm transition-colors"
            title="Làm mới"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Đang tải danh sách đơn...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-sm text-gray-500">
              Khi khách hàng đặt hàng, đơn sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái (Click để đổi)</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="font-mono text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        #{order._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-gray-900">
                        {order.shippingInfo?.fullName || "Khách ẩn danh"}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {order.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      <span className="block text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-sm text-red-600">
                        {order.totalPrice?.toLocaleString("vi-VN")} ₫
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={
                            order.status === "cancelled" ||
                            order.status === "delivered"
                          }
                          className={`appearance-none border pl-3 pr-8 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors ${getStatusColor(order.status)} ${order.status === "cancelled" || order.status === "delivered" ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="shipped">Đang giao hàng</option>
                          <option value="delivered">Đã giao thành công</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderPage;

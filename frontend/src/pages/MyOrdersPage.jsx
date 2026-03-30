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
        setOrders(response.data || []);
      } catch (error) {
        console.log("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang chuẩn bị hàng";
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Đang tải lịch sử mua hàng...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi trạng thái giao hàng và lịch sử mua sắm.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            Bạn chưa thực hiện giao dịch nào. Hãy khám phá các mẫu laptop mới
            nhất nhé!
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-1"
          >
            Bắt đầu mua sắm
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-5">Mã đơn hàng</th>
                  <th className="px-6 py-5">Ngày đặt</th>
                  <th className="px-6 py-5">Tổng tiền</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <Link
                        to={`/order/${order._id}`}
                        className="font-mono text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                      >
                        #{order._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-black text-gray-900">
                      {order.totalPrice?.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                      >
                        Xem
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
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;

// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import statsApi from "../../api/statsApi";

function DashboardPage() {
  const [stats, setStats] = useState({
    revenue: { total: 0, today: 0 },
    orders: { total: 0, pending: 0, delivered: 0 },
    products: { total: 0, outOfStock: 0 },
    users: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsApi.getOverview();
        if (response && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Đang đồng bộ dữ liệu hệ thống...
        </p>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-500 mt-1">
            Cập nhật lần cuối: Hôm nay lúc{" "}
            {new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Xuất báo cáo
        </button>
      </div>

      {/* --- 4 THẺ THỐNG KÊ (KPI CARDS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Doanh Thu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Tổng Doanh Thu
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {stats.revenue?.total?.toLocaleString("vi-VN") || 0} ₫
              </h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded mr-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              +12.5%
            </span>
            <span className="text-gray-400">so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: Đơn Hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Tổng Đơn Hàng
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {stats.orders?.total?.toLocaleString("vi-VN") || 0}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded mr-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              +8.2%
            </span>
            <span className="text-gray-400">so với tháng trước</span>
          </div>
        </div>

        {/* Card 3: Sản Phẩm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Kho Sản Phẩm
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {stats.products?.total?.toLocaleString("vi-VN") || 0}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {stats.products?.outOfStock > 0 ? (
              <span className="flex items-center text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded mr-2">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {stats.products.outOfStock}
              </span>
            ) : (
              <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded mr-2">
                ✓
              </span>
            )}
            <span className="text-gray-400">sản phẩm hết hàng</span>
          </div>
        </div>

        {/* Card 4: Khách Hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Khách Hàng
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {stats.users?.total?.toLocaleString("vi-VN") || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded mr-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              +24
            </span>
            <span className="text-gray-400">người dùng mới</span>
          </div>
        </div>
      </div>

      {/* --- CHI TIẾT HOẠT ĐỘNG --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tình trạng đơn hàng */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Tiến độ đơn hàng
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-amber-600">Đang chờ xử lý</span>
                <span className="text-gray-900">
                  {stats.orders?.pending || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(((stats.orders?.pending || 0) / (stats.orders?.total || 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-emerald-600">Đã giao thành công</span>
                <span className="text-gray-900">
                  {stats.orders?.delivered || 0} đơn
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(((stats.orders?.delivered || 0) / (stats.orders?.total || 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hoạt động trong ngày */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-500"
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
            Hoạt động trong ngày
          </h3>

          <div className="flex items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-indigo-600">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
                Doanh thu hôm nay
              </p>
              <p className="text-xl font-black text-indigo-700">
                {stats.revenue?.today?.toLocaleString("vi-VN") || 0} ₫
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-gray-600">
                  Hệ thống hoạt động
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                Bình thường
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

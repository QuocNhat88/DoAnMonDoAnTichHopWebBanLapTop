// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import statsApi from "../../api/statsApi";

function DashboardPage() {
  // State lưu số liệu (Khởi tạo đúng cấu trúc để không lỗi null)
  const [stats, setStats] = useState({
    revenue: { total: 0 },
    orders: { total: 0 },
    products: { total: 0 },
    users: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsApi.getOverview();
        console.log("Dữ liệu thống kê:", response);

        // Backend trả về: { success: true, data: { revenue: {...}, orders: {...} } }
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
    return <div className="p-10 text-center">Đang tính toán số liệu...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Tổng quan (Dashboard)
      </h1>

      {/* 4 Cục thống kê - DỮ LIỆU THẬT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* 1. Doanh thu */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Tổng Doanh Thu</h3>
          <p className="text-3xl font-bold mt-2">
            {/* Sửa lại đường dẫn lấy dữ liệu: stats.revenue.total */}
            {stats.revenue?.total?.toLocaleString("vi-VN") || 0} đ
          </p>
        </div>

        {/* 2. Đơn hàng */}
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Đơn hàng</h3>
          <p className="text-3xl font-bold mt-2">
            {/* stats.orders.total */}
            {stats.orders?.total || 0}
          </p>
        </div>

        {/* 3. Sản phẩm */}
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Sản phẩm</h3>
          <p className="text-3xl font-bold mt-2">
            {/* stats.products.total */}
            {stats.products?.total || 0}
          </p>
        </div>

        {/* 4. Khách hàng */}
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Khách hàng</h3>
          <p className="text-3xl font-bold mt-2">
            {/* stats.users.total */}
            {stats.users?.total || 0}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Chi tiết hoạt động
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            Đơn hàng chờ xử lý: <strong>{stats.orders?.pending || 0}</strong>
          </li>
          <li>
            Đơn hàng giao thành công:{" "}
            <strong>{stats.orders?.delivered || 0}</strong>
          </li>
          <li>
            Sản phẩm hết hàng:{" "}
            <strong className="text-red-500">
              {stats.products?.outOfStock || 0}
            </strong>
          </li>
          <li>
            Doanh thu hôm nay:{" "}
            <strong>
              {stats.revenue?.today?.toLocaleString("vi-VN") || 0} đ
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;

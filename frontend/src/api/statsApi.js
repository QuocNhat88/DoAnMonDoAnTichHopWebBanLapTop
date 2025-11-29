// src/api/statsApi.js
import axiosClient from "./axiosClient";

const statsApi = {
  // Lấy số liệu tổng quan (Doanh thu, tổng đơn, tổng user...)
  getOverview: () => {
    return axiosClient.get("/statistics/overview");
  },

  // (Nếu sau này cần biểu đồ thì thêm hàm getRevenue ở đây)
};

export default statsApi;

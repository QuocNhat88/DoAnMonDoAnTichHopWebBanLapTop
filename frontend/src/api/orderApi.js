// src/api/orderApi.js
import axiosClient from "./axiosClient";

const orderApi = {
  // Hàm tạo đơn hàng mới
  createOrder: (data) => {
    const url = "/orders";
    return axiosClient.post(url, data);
  },

  // Lấy danh sách đơn hàng của người đang đăng nhập
  getMyOrders: () => {
    // SỬA Ở ĐÂY: Thêm dấu gạch ngang cho khớp với backend
    const url = "/orders/my-orders";
    return axiosClient.get(url);
  },

  // Hàm xem chi tiết 1 đơn hàng
  getOrderById: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },

  // Hủy đơn hàng
  cancelOrder: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  },

  // Admin lấy tất cả đơn hàng
  getAllOrders: () => {
    return axiosClient.get("/orders");
  },

  // Admin cập nhật trạng thái
  updateStatus: (id, status) => {
    return axiosClient.put(`/orders/${id}/status`, { status });
  },
};

export default orderApi;

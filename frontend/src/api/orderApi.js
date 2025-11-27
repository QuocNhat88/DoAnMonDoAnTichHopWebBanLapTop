// src/api/orderApi.js
import axiosClient from "./axiosClient";

const orderApi = {
  // Hàm tạo đơn hàng mới
  createOrder: (data) => {
    // Đường dẫn dựa trên router backend bạn cung cấp: /api/orders
    const url = "/orders";
    return axiosClient.post(url, data);
  },
  // Lấy danh sách đơn hàng của người đang đăng nhập
  getMyOrders: () => {
    const url = "/orders/myorders";
    return axiosClient.get(url);
  },

  //  hàm xem chi tiết 1 đơn hàng để dùng sau này)
  getOrderById: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
  //hủy đơn hàng
  cancelOrder: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  },
};

export default orderApi;

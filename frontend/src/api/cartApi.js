// src/api/cartApi.js
import axiosClient from "./axiosClient";

const cartApi = {
  // 1. Lấy giỏ hàng từ Database về
  getMyCart: () => {
    return axiosClient.get("/cart");
  },

  // 2. Thêm vào giỏ (Backend yêu cầu: { productId, quantity })
  addToCart: (data) => {
    return axiosClient.post("/cart/add", data);
  },

  // 3. Cập nhật số lượng (Backend yêu cầu: { productId, quantity })
  updateQuantity: (data) => {
    return axiosClient.put("/cart/update", data);
  },

  // 4. Xóa món hàng (Backend yêu cầu productId trên URL)
  removeFromCart: (productId) => {
    return axiosClient.delete(`/cart/remove/${productId}`);
  },
};

export default cartApi;

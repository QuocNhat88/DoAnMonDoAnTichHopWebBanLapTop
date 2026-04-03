// src/api/cartApi.js
import axiosClient from "./axiosClient";

const cartApi = {
  // 1. Lấy giỏ hàng
  // Backend: router.get("/", ...) -> URL: /api/cart
  getMyCart: () => {
    return axiosClient.get("/cart");
  },

  // 2. Thêm vào giỏ
  // Backend: router.post("/", ...) -> URL: /api/cart
  // Data gửi lên: { productId, quantity }
  addToCart: (data) => {
    return axiosClient.post("/cart", data); // Bỏ chữ /add đi
  },

  // 3. Cập nhật số lượng
  // Backend: router.put("/", ...) -> URL: /api/cart
  // Data gửi lên: { productId, newQuantity }
  updateQuantity: (data) => {
    return axiosClient.put("/cart", data); // Bỏ chữ /update đi
  },

  // 4. Xóa món hàng
  // Backend: router.delete("/:productId", ...) -> URL: /api/cart/ID_SP
  removeFromCart: (productId) => {
    return axiosClient.delete(`/cart/${productId}`); // Bỏ chữ /remove đi
  },
};

export default cartApi;

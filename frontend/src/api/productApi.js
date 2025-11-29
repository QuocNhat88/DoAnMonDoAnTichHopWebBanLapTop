// src/api/productApi.js
import axiosClient from "./axiosClient";

const productApi = {
  // Lấy danh sách (có lọc)
  getAll: (params) => {
    return axiosClient.get("/products", { params });
  },

  // Lấy chi tiết 1 sản phẩm
  get: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  // --- CÁC HÀM CHO ADMIN ---

  // 1. Thêm sản phẩm mới
  add: (data) => {
    return axiosClient.post("/products", data);
  },

  // 2. Cập nhật sản phẩm (Sửa)
  update: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  // 3. Xóa sản phẩm
  delete: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productApi;

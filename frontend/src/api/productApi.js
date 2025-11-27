// src/api/productApi.js
import axiosClient from "./axiosClient";

const productApi = {
  // Hàm lấy tất cả sản phẩm
  getAll: (params) => {
    // axios hỗ trợ truyền params dạng object, nó sẽ tự chuyển thành ?keyword=...
    return axiosClient.get("/products", { params });
  },

  // Hàm lấy chi tiết 1 sản phẩm (sau này sẽ dùng)
  get: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
};

export default productApi;

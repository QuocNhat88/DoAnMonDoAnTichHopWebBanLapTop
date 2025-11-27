// src/api/productApi.js
import axiosClient from "./axiosClient";

const productApi = {
  // Hàm lấy tất cả sản phẩm
  getAll: (params) => {
    // Gọi đến đường dẫn: /products (sẽ ghép với baseURL ở trên thành http://localhost:5000/api/products)
    const url = "/products";
    return axiosClient.get(url, { params });
  },

  // Hàm lấy chi tiết 1 sản phẩm (sau này sẽ dùng)
  get: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
};

export default productApi;

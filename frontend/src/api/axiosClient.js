// src/api/axiosClient.js

import axios from "axios";

// Thiết lập cấu hình mặc định
const axiosClient = axios.create({
  // baseURL: Đây là địa chỉ Backend của bạn.
  // LƯU Ý: Bạn cần kiểm tra lại Backend của bạn đang chạy cổng nào (3000, 4000 hay 5000?)
  // Tôi đang giả định là 5000, hãy sửa lại số 5000 nếu backend của bạn khác.
  baseURL: "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý dữ liệu trả về (Response Interceptor)
// Cái này giúp bạn nhận về dữ liệu sạch (data) thay vì nhận cả cục response phức tạp của HTTP
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu thành công, trả về dữ liệu (response.data)
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Nếu có lỗi (ví dụ 404, 500), ném lỗi ra để Frontend xử lý sau
    throw error;
  }
);

export default axiosClient;

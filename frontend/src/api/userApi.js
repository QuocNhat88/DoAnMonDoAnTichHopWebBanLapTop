// src/api/userApi.js
import axiosClient from "./axiosClient";

const userApi = {
  // Lấy tất cả user (Admin only)
  getAll: () => {
    return axiosClient.get("/users");
  },

  // Xóa user
  delete: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },

  // (Tuỳ chọn) Nâng cấp/Hạ cấp quyền Admin
  // Backend bạn có route: router.put("/:id/role", ...) không?
  // Nếu có thì dùng hàm này, nếu chưa thì tạm thời bỏ qua
  updateRole: (id, role) => {
    // role gửi lên là { role: 'admin' } hoặc { role: 'user' }
    return axiosClient.put(`/users/${id}/role`, { role });
  },
};

export default userApi;

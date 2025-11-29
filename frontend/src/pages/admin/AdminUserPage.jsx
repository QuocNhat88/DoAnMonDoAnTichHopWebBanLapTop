// src/pages/admin/AdminUserPage.jsx
import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";

function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách user
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
      // Backend trả về: { success: true, users: [...] } hoặc { data: [...] }
      setUsers(response.data || response.users || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xóa user
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await userApi.delete(id);
        alert("Đã xóa thành công!");
        // Cập nhật lại danh sách (bỏ người vừa xóa đi)
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert(
          "Lỗi xóa user: " + (error.response?.data?.message || error.message)
        );
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">Đang tải danh sách người dùng...</div>
    );

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Người dùng ({users.length})
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm uppercase text-gray-600">
              <th className="p-3">Avatar</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Ngày tham gia</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="p-3 font-medium">
                  {user.fullName || user.username}
                </td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3">
                  {user.role === "admin" ? (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                      ADMIN
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                      USER
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 text-center">
                  {/* Không cho phép xóa chính mình (nếu logic frontend có check id) */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserPage;

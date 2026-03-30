// src/pages/admin/AdminUserPage.jsx
import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";

function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
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

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Bạn có chắc muốn xóa vĩnh viễn người dùng này?")) {
      try {
        await userApi.delete(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert(
          "Lỗi xóa user: " + (error.response?.data?.message || error.message),
        );
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Tài khoản Hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách Quản trị viên và Khách hàng.
          </p>
        </div>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm">
          Tổng cộng: <span className="text-blue-600">{users.length}</span> user
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Chưa có người dùng
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4 w-16 text-center">Avatar</th>
                  <th className="px-6 py-4">Thông tin User</th>
                  <th className="px-6 py-4">Phân quyền</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner mx-auto ${user.role === "admin" ? "bg-gradient-to-br from-red-500 to-rose-600 text-white" : "bg-blue-100 text-blue-600"}`}
                      >
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-gray-900">
                        {user.fullName || user.username}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Khách hàng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={user.role === "admin"} // Logic cơ bản: Tránh tự xóa admin
                          className={`p-2 rounded-lg transition-colors ${user.role === "admin" ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-red-600 hover:bg-red-50"}`}
                          title={
                            user.role === "admin"
                              ? "Không thể xóa Admin"
                              : "Xóa user"
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserPage;

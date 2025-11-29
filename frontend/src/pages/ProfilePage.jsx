// src/pages/ProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import authApi from "../api/authApi";

function ProfilePage() {
  const { user, login } = useContext(AuthContext);

  // State 1: Thông tin cá nhân
  const [profile, setProfile] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  // State 2: Đổi mật khẩu
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Điền dữ liệu user vào form khi trang vừa load
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  // --- HÀM 1: CẬP NHẬT THÔNG TIN ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.updateProfile(profile);
      alert("Cập nhật thông tin thành công!");

      // Lưu lại thông tin mới vào Context để Header tự cập nhật tên
      const token = localStorage.getItem("token");
      login(response.data, token);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi cập nhật");
    }
  };

  // --- HÀM 2: ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra 2 ô mật khẩu mới có khớp nhau không
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    // 2. Kiểm tra độ dài (Backend của bạn yêu cầu min 6 ký tự)
    if (passwords.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      // 3. Gọi API (Backend yêu cầu: currentPassword, newPassword)
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      alert("Đổi mật khẩu thành công!");

      // 4. Reset form về rỗng
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error(error);
      // Hiển thị lỗi từ Backend (ví dụ: "Mật khẩu hiện tại không chính xác")
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Tài khoản của tôi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* --- CỘT TRÁI: CẬP NHẬT THÔNG TIN --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-6 text-blue-700 flex items-center gap-2">
            📝 Thông tin cá nhân
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Họ và tên
              </label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Số điện thoại
              </label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Địa chỉ mặc định
              </label>
              <textarea
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                rows="3"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold transition"
            >
              LƯU THAY ĐỔI
            </button>
          </form>
        </div>

        {/* --- CỘT PHẢI: ĐỔI MẬT KHẨU --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit border-t-4 border-red-500">
          <h2 className="text-xl font-bold mb-6 text-red-700 flex items-center gap-2">
            🔒 Đổi mật khẩu
          </h2>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-red-500"
                required
                placeholder="********"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-red-500"
                required
                placeholder="Ít nhất 6 ký tự"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-red-500"
                required
                placeholder="Nhập lại chính xác"
                value={passwords.confirmNewPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmNewPassword: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold transition"
            >
              ĐỔI MẬT KHẨU
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

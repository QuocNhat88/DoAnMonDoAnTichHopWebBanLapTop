// src/pages/ProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import authApi from "../api/authApi";

function ProfilePage() {
  const { user, login } = useContext(AuthContext);

  // State lưu thông tin cá nhân
  const [profile, setProfile] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  // State lưu mật khẩu để đổi
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Khi vào trang, tự động điền thông tin hiện tại vào ô nhập
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  // --- XỬ LÝ CẬP NHẬT THÔNG TIN ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Gọi API cập nhật
      const response = await authApi.updateProfile(profile);
      alert("Cập nhật thông tin thành công!");

      // Quan trọng: Cập nhật lại dữ liệu user trong Context (Web)
      // Để Header và trang Checkout tự động nhận tên mới
      const token = localStorage.getItem("token");
      // Backend trả về user mới trong response.data
      login(response.data, token);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Lỗi cập nhật");
    }
  };

  // --- XỬ LÝ ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu nhập lại
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      // Reset ô nhập về rỗng
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Tài khoản của tôi
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- CỘT TRÁI: CẬP NHẬT THÔNG TIN --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Thông tin cá nhân
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Họ và tên</label>
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
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile({ ...profile, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
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
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>

        {/* --- CỘT PHẢI: ĐỔI MẬT KHẨU --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Đổi mật khẩu</h2>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                required
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
              <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                required
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded focus:outline-blue-500"
                required
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
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-medium"
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

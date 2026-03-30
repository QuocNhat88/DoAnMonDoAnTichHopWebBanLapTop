// src/pages/ProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import authApi from "../api/authApi";

function ProfilePage() {
  const { user, login } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await authApi.updateProfile(profile);
      alert("🎉 Cập nhật thông tin thành công!");
      const token = localStorage.getItem("token");
      login(response.data, token);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "❌ Lỗi cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("❌ Mật khẩu nhập lại không khớp!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      alert("❌ Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setIsChangingPass(true);
    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert("🎉 Đổi mật khẩu thành công!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ " + (error.response?.data?.message || "Đổi mật khẩu thất bại"));
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Tài khoản của tôi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md border-4 border-blue-50">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.username}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block mt-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Thông tin liên hệ
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                  placeholder="090xxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Địa chỉ mặc định
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none custom-scrollbar"
                  rows="3"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  placeholder="Số nhà, đường, phường/xã..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating && (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Cập nhật thông tin
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: ĐỔI MẬT KHẨU */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Đổi mật khẩu
            </h2>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5 relative z-10"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  placeholder="Ít nhất 6 ký tự"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwords.confirmNewPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChangingPass && (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

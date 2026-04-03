const User = require("./user.model"); // Đảm bảo đường dẫn tới model user đúng
const mongoose = require("mongoose");

// --- 1. LẤY HỒ SƠ CÁ NHÂN (Cho người dùng đang đăng nhập) ---
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }
};

// --- 2. CẬP NHẬT HỒ SƠ CÁ NHÂN ---
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật thành công!",
        data: updatedUser,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. [ADMIN] LẤY TẤT CẢ NGƯỜI DÙNG ---
const getAllUsers = async (req, res) => {
  try {
    // Lấy toàn bộ user, bỏ mật khẩu, sắp xếp mới nhất lên đầu
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users, // Frontend sẽ chọc vào đây
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi Server khi lấy danh sách user" });
  }
};

// --- 4. [ADMIN] XÓA NGƯỜI DÙNG ---
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Không cho phép admin tự xóa chính mình
    if (userId === req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn không thể tự xóa chính mình!" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    if (user.role === "admin")
      return res
        .status(403)
        .json({ success: false, message: "Không thể xóa Admin khác" });

    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ success: true, message: "Xóa người dùng thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMe,
  updateProfile,
  getAllUsers,
  deleteUser,
};

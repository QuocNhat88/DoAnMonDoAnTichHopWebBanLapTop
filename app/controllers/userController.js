// Import Model User
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * --- HÀM 1: LẤY TẤT CẢ USERS (GET ALL) ---
 * Logic cho: GET /api/users
 * Quyền truy cập: Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    // Lấy các tham số từ query (phân trang, tìm kiếm, lọc)
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định: 1)
    const limit = parseInt(req.query.limit) || 10; // Số lượng mỗi trang (mặc định: 10)
    const keyword = req.query.keyword || ""; // Từ khóa tìm kiếm
    const role = req.query.role || ""; // Lọc theo role (user/admin)

    // Tạo object tìm kiếm
    const searchQuery = {};

    // Nếu có keyword, tìm trong username và email
    if (keyword) {
      searchQuery.$or = [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // Nếu có role, lọc theo role
    if (role) {
      searchQuery.role = role;
    }

    // Tính toán skip (bỏ qua bao nhiêu bản ghi)
    const skip = (page - 1) * limit;

    // Tìm users với phân trang
    const users = await User.find(searchQuery)
      .select("-password") // Không trả về password
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo (mới nhất trước)
      .skip(skip)
      .limit(limit);

    // Đếm tổng số users (không phân trang)
    const total = await User.countDocuments(searchQuery);

    // Trả về kết quả
    res.status(200).json({
      success: true,
      count: users.length,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 2: LẤY CHI TIẾT 1 USER (GET BY ID) ---
 * Logic cho: GET /api/users/:id
 * Quyền truy cập: Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ.",
      });
    }

    // Tìm user (không trả về password)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết user:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 3: CẬP NHẬT THÔNG TIN USER (UPDATE) ---
 * Logic cho: PUT /api/users/:id
 * Quyền truy cập: Private/Admin
 */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ.",
      });
    }

    // Tìm user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Kiểm tra email có bị trùng không (nếu có cập nhật email)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email này đã được sử dụng.",
        });
      }
    }

    // Kiểm tra username có bị trùng không (nếu có cập nhật username)
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({
        username: updateData.username,
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username này đã được sử dụng.",
        });
      }
    }

    // Cập nhật các trường (chỉ cập nhật các trường được gửi lên)
    if (updateData.fullName !== undefined) user.fullName = updateData.fullName;
    if (updateData.address !== undefined) user.address = updateData.address;
    if (updateData.phoneNumber !== undefined)
      user.phoneNumber = updateData.phoneNumber;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.username !== undefined) user.username = updateData.username;

    // Lưu lại
    const updatedUser = await user.save();

    // Trả về kết quả (không trả về password)
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin người dùng thành công!",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        address: updatedUser.address,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 4: XÓA USER (DELETE) ---
 * Logic cho: DELETE /api/users/:id
 * Quyền truy cập: Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id; // ID của admin đang thực hiện

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ.",
      });
    }

    // Không cho phép xóa chính mình
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể xóa tài khoản của chính mình.",
      });
    }

    // Tìm user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Không cho phép xóa admin khác (chỉ cho phép xóa user thường)
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Không thể xóa tài khoản admin khác.",
      });
    }

    // Xóa user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công!",
      data: {},
    });
  } catch (error) {
    console.error("Lỗi khi xóa user:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 5: THAY ĐỔI ROLE (UPDATE ROLE) ---
 * Logic cho: PUT /api/users/:id/role
 * Quyền truy cập: Private/Admin
 */
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const currentUserId = req.user.id; // ID của admin đang thực hiện

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ.",
      });
    }

    // Kiểm tra role có được gửi không
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp role mới.",
      });
    }

    // Kiểm tra role có hợp lệ không
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ. Chỉ có thể là 'user' hoặc 'admin'.",
      });
    }

    // Không cho phép thay đổi role của chính mình
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể thay đổi role của chính mình.",
      });
    }

    // Tìm user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Cập nhật role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Thay đổi role thành công! Người dùng hiện tại là: ${role}`,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi thay đổi role:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
};

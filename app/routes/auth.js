const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
// --- PHẦN CẬP NHẬT (Import thêm 3 hàm mới) ---
const {
  register,
  login,
  getMe,
  updateUserProfile,
  forgotPassword, // (Hàm mới - Quên mật khẩu)
  resetPassword, // (Hàm mới - Đặt lại mật khẩu)
  changePassword, // (Hàm mới - Đổi mật khẩu)
} = require("../controllers/authController");

// 2. Import "người bảo vệ" (middleware)
const { protect } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// (Các route cũ của bạn)
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// --- PHẦN CẬP NHẬT (THÊM 3 TUYẾN ĐƯỜNG MỚI) ---

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin cá nhân (Tên, địa chỉ, SĐT)
 * @access  Private (User)
 */
// (Chỉ cần 'protect' để biết "profile" của AI)
router.put("/profile", protect, updateUserProfile);

/**
 * @route   POST /api/auth/forgotpassword
 * @desc    Gửi email reset mật khẩu
 * @access  Public
 */
// (Không cần đăng nhập, ai cũng có thể yêu cầu reset)
router.post("/forgotpassword", forgotPassword);

/**
 * @route   PUT /api/auth/resetpassword/:resetToken
 * @desc    Đặt lại mật khẩu mới với token
 * @access  Public
 */
// (resetToken là token được gửi qua email)
router.put("/resetpassword/:resetToken", resetPassword);

/**
 * @route   PUT /api/auth/changepassword
 * @desc    Đổi mật khẩu (khi đã đăng nhập)
 * @access  Private (User)
 */
router.put("/changepassword", protect, changePassword);
// --- Xuất (Export) router này ra ---
module.exports = router;

const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
// --- PHẦN CẬP NHẬT (Import thêm 1 hàm mới) ---
const {
  register,
  login,
  getMe,
  updateUserProfile, // (Hàm mới)
} = require("../controllers/authController");

// 2. Import "người bảo vệ" (middleware)
const { protect } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// (Các route cũ của bạn)
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// --- PHẦN CẬP NHẬT (THÊM 1 TUYẾN ĐƯỜNG MỚI) ---

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin cá nhân (Tên, địa chỉ, SĐT)
 * @access  Private (User)
 */
// (Chỉ cần 'protect' để biết "profile" của AI)
router.put("/profile", protect, updateUserProfile);

// --- Xuất (Export) router này ra ---
module.exports = router;

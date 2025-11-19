const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
const userController = require("../controllers/userController");

// 2. Import "người bảo vệ" (middleware)
//    Chúng ta cần cả 2:
//    - 'protect': để biết BẠN LÀ AI (đã login chưa)
//    - 'isAdmin': để biết BẠN CÓ PHẢI ADMIN KHÔNG
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách tất cả users (có phân trang, tìm kiếm, lọc)
 * @access  Private/Admin
 * @query   page, limit, keyword, role
 */
router.get("/", protect, isAdmin, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Lấy chi tiết 1 user
 * @access  Private/Admin
 */
router.get("/:id", protect, isAdmin, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Cập nhật thông tin user
 * @access  Private/Admin
 */
router.put("/:id", protect, isAdmin, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa user
 * @access  Private/Admin
 */
router.delete("/:id", protect, isAdmin, userController.deleteUser);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Thay đổi role của user (user ↔ admin)
 * @access  Private/Admin
 */
router.put("/:id/role", protect, isAdmin, userController.updateUserRole);

// --- Xuất (Export) router này ra ---
module.exports = router;

const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
const categoryController = require("../controllers/categoryController");

// 2. Import "người bảo vệ" (middleware)
//    Chúng ta cần cả 2:
//    - 'protect': để biết BẠN LÀ AI (đã login chưa)
//    - 'isAdmin': để biết BẠN CÓ PHẢI ADMIN KHÔNG
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

/**
 * @route   POST /api/categories
 * @desc    Tạo một danh mục mới
 * @access  Private/Admin
 */
// "protect" chạy trước, "isAdmin" chạy thứ 2, "createCategory" chạy cuối
router.post("/", protect, isAdmin, categoryController.createCategory);

/**
 * @route   GET /api/categories
 * @desc    Lấy tất cả danh mục
 * @access  Public
 */
// Route này không cần 'protect', ai cũng xem được
router.get("/", categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Lấy chi tiết 1 danh mục
 * @access  Public
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @route   PUT /api/categories/:id
 * @desc    Cập nhật danh mục
 * @access  Private/Admin
 */
router.put("/:id", protect, isAdmin, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Xóa danh mục
 * @access  Private/Admin
 */
router.delete("/:id", protect, isAdmin, categoryController.deleteCategory);

// --- Xuất (Export) router này ra ---
// ĐÂY LÀ DÒNG ĐÃ SỬA LỖI (exports thay vì module)
module.exports = router;

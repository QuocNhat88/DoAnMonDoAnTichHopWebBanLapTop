const express = require("express");
const router = express.Router();

// 1. Import (Thương hiệu) Controller
const brandController = require("../controllers/brandController");

// 2. Import "người bảo vệ" (middleware)
//    Chúng ta cần cả 2:
//    - 'protect': để biết BẠN LÀ AI (đã login chưa)
//    - 'isAdmin': để biết BẠN CÓ PHẢI ADMIN KHÔNG
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

/**
 * @route   POST /api/brands
 * @desc    Tạo một danh mục mới
 * @access  Private/Admin
 */
// "protect" chạy trước, "isAdmin" chạy thứ 2, "createCategory" chạy cuối
router.post("/", protect, isAdmin, brandController.createBrand);

/**
 * @route   GET /api/brands
 * @desc    Lấy tất cả danh mục
 * @access  Public
 */
// Route này không cần 'protect', ai cũng xem được
router.get("/", brandController.getAllBrands);

/**
 * @route   GET /api/brands/:id
 * @desc    Lấy chi tiết 1 thương hiệu
 * @access  Public
 */
router.get("/:id", brandController.getBrandById);

/**
 * @route   PUT /api/brands/:id
 * @desc    Cập nhật thương hiệu
 * @access  Private/Admin
 */
router.put("/:id", protect, isAdmin, brandController.updateBrand);

/**
 * @route   DELETE /api/brands/:id
 * @desc    Xóa thương hiệu
 * @access  Private/Admin
 */
router.delete("/:id", protect, isAdmin, brandController.deleteBrand);

// --- Xuất (Export) router này ra ---
// ĐÂY LÀ DÒNG ĐÃ SỬA LỖI (exports thay vì module)
module.exports = router;

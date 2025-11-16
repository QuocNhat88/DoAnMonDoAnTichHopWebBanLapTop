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
 * @route   POST /api/categories
 * @desc    Tạo một danh mục mới
 * @access  Private/Admin
 */
// "protect" chạy trước, "isAdmin" chạy thứ 2, "createCategory" chạy cuối
router.post("/", protect, isAdmin, brandController.createBrand);

/**
 * @route   GET /api/categories
 * @desc    Lấy tất cả danh mục
 * @access  Public
 */
// Route này không cần 'protect', ai cũng xem được
router.get("/", brandController.getAllBrands);

// (Chúng ta sẽ thêm route GET /:id, PUT /:id, DELETE /:id sau)

// --- Xuất (Export) router này ra ---
// ĐÂY LÀ DÒNG ĐÃ SỬA LỖI (exports thay vì module)
module.exports = router;

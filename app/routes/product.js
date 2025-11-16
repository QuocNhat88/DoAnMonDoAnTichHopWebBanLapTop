const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
// --- PHẦN CẬP NHẬT (Import thêm 3 hàm mới) ---
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// 2. Import "người bảo vệ" (middleware)
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// (Các route cũ của bạn)
// POST /api/products (Admin)
router.post("/", protect, isAdmin, createProduct);
// GET /api/products (Public)
router.get("/", getAllProducts);

// --- PHẦN CẬP NHẬT (THÊM 3 TUYẾN ĐƯỜNG MỚI) ---
// Giải thích: ':id' là "tham số đường dẫn" (route parameter)
// Express sẽ "bắt" lấy giá trị (vd: 69f...) và gán nó vào req.params.id

/**
 * @route   GET /api/products/:id
 * @desc    Lấy chi tiết 1 sản phẩm
 * @access  Public
 */
// (Ai cũng được xem chi tiết)
router.get("/:id", getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật (sửa) 1 sản phẩm
 * @access  Private/Admin
 */
// (Chỉ Admin mới được sửa)
router.put("/:id", protect, isAdmin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa 1 sản phẩm
 * @access  Private/Admin
 */
// (Chỉ Admin mới được xóa)
router.delete("/:id", protect, isAdmin, deleteProduct);

// --- Xuất (Export) router này ra ---
module.exports = router;

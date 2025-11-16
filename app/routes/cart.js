const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
// --- PHẦN CẬP NHẬT (Import thêm 2 hàm mới) ---
const {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
} = require("../controllers/cartController");

// 2. Import "người bảo vệ" (middleware)
const { protect } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// (Các route cũ của bạn)
router.post("/add", protect, addToCart);
router.get("/", protect, getMyCart);

// --- PHẦN CẬP NHẬT (THÊM 2 TUYẾN ĐƯỜNG MỚI) ---

/**
 * @route   PUT /api/cart/update
 * @desc    Cập nhật số lượng sản phẩm
 * @access  Private (User)
 */
// PUT là phương thức dùng để Cập nhật
router.put("/update", protect, updateCartItemQuantity);

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Xóa một sản phẩm khỏi giỏ
 * @access  Private (User)
 */
// DELETE là phương thức dùng để Xóa
// :productId là "tham số đường dẫn" (giống Bước 9)
router.delete("/remove/:productId", protect, removeCartItem);

// --- Xuất (Export) router này ra ---
module.exports = router;

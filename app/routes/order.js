const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
// --- PHẦN CẬP NHẬT (Import thêm 1 hàm mới) ---
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder, // (Hàm mới)
} = require("../controllers/orderController");

// 2. Import "người bảo vệ" (middleware)
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// (Các route cũ của bạn)
router.post("/", protect, createOrder); // User
router.get("/myorders", protect, getMyOrders); // User
router.get("/", protect, isAdmin, getAllOrders); // Admin
router.get("/:id", protect, getOrderById); // User/Admin
router.put("/:id/status", protect, isAdmin, updateOrderStatus); // Admin

// --- PHẦN CẬP NHẬT (THÊM 1 TUYẾN ĐƯỜNG MỚI) ---

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Hủy đơn hàng (User)
 * @access  Private (User)
 */
// (Chỉ cần 'protect' - logic sở hữu nằm trong Controller)
router.put("/:id/cancel", protect, cancelOrder);

// --- Xuất (Export) router này ra ---
module.exports = router;

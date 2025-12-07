const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  webhookCasso, // <--- THÊM HÀM NÀY VÀO
} = require("../controllers/orderController");

// 2. Import "người bảo vệ" (middleware)
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

// --- ROUTE ĐẶC BIỆT (WEBHOOK) ---
// Phải đặt route này LÊN TRƯỚC route /:id để tránh bị nhầm lẫn
// QUAN TRỌNG: Không dùng middleware 'protect' vì Casso gọi từ bên ngoài
router.post("/webhook/casso", webhookCasso);

// --- CÁC ROUTE KHÁC ---

router.post("/", protect, createOrder); // Tạo đơn hàng
router.get("/myorders", protect, getMyOrders); // Xem lịch sử đơn của tôi
router.get("/", protect, isAdmin, getAllOrders); // Admin xem tất cả

// --- Route thao tác trên ID cụ thể ---
router.get("/:id", protect, getOrderById); // Xem chi tiết 1 đơn
router.put("/:id/status", protect, isAdmin, updateOrderStatus); // Admin cập nhật trạng thái
router.put("/:id/cancel", protect, cancelOrder); // Hủy đơn hàng

// --- Xuất (Export) router này ra ---
module.exports = router;

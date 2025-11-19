const express = require("express");
const router = express.Router();

// 1. Import (nhập khẩu) Controller
const statisticsController = require("../controllers/statisticsController");

// 2. Import "người bảo vệ" (middleware)
const { protect, isAdmin } = require("../middleware/authMiddleware");

// --- Định nghĩa các tuyến đường (routes) ---

/**
 * @route   GET /api/statistics/overview
 * @desc    Lấy tổng quan thống kê (doanh thu, đơn hàng, user, sản phẩm)
 * @access  Private/Admin
 */
router.get("/overview", protect, isAdmin, statisticsController.getOverview);

/**
 * @route   GET /api/statistics/revenue
 * @desc    Lấy doanh thu theo thời gian
 * @access  Private/Admin
 * @query   period (day/week/month/year), startDate, endDate
 */
router.get("/revenue", protect, isAdmin, statisticsController.getRevenue);

/**
 * @route   GET /api/statistics/orders-by-status
 * @desc    Lấy đơn hàng theo trạng thái
 * @access  Private/Admin
 */
router.get(
  "/orders-by-status",
  protect,
  isAdmin,
  statisticsController.getOrdersByStatus
);

/**
 * @route   GET /api/statistics/top-products
 * @desc    Lấy sản phẩm bán chạy
 * @access  Private/Admin
 * @query   limit (số lượng sản phẩm, mặc định: 10)
 */
router.get(
  "/top-products",
  protect,
  isAdmin,
  statisticsController.getTopProducts
);

/**
 * @route   GET /api/statistics/users
 * @desc    Lấy thống kê người dùng
 * @access  Private/Admin
 */
router.get("/users", protect, isAdmin, statisticsController.getUserStatistics);

/**
 * @route   GET /api/statistics/revenue-by-payment
 * @desc    Lấy doanh thu theo phương thức thanh toán
 * @access  Private/Admin
 */
router.get(
  "/revenue-by-payment",
  protect,
  isAdmin,
  statisticsController.getRevenueByPaymentMethod
);

// --- Xuất (Export) router này ra ---
module.exports = router;

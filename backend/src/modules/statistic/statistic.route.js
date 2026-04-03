const express = require("express");
const router = express.Router();
const statisticController = require("./statistic.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

// TẤT CẢ API THỐNG KÊ ĐỀU BẮT BUỘC LÀ ADMIN
router.use(protect);
router.use(authorize("admin"));

router.get("/overview", statisticController.getOverview);
router.get("/revenue", statisticController.getRevenue);
router.get("/orders-by-status", statisticController.getOrdersByStatus);
router.get("/top-products", statisticController.getTopProducts);
router.get("/users", statisticController.getUserStatistics);
router.get(
  "/revenue-by-payment",
  statisticController.getRevenueByPaymentMethod,
);

module.exports = router;

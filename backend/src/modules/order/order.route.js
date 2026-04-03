const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const validate = require("../../middlewares/validate");
const orderSchema = require("./order.schema");
const { protect, authorize } = require("../../middlewares/auth.middleware");

// WEBHOOK CASSO (Phải đặt ở trên cùng, không được protect vì Casso gọi từ ngoài vào)
router.post("/webhook-casso", orderController.webhookCasso);

// Bắt buộc đăng nhập cho các route dưới
router.use(protect);

// ROUTE CỦA USER
router.post(
  "/",
  validate(orderSchema.createOrderSchema),
  orderController.createOrder,
);
router.get("/my-orders", orderController.getMyOrders);
router.get(
  "/:id",
  validate(orderSchema.orderIdParamSchema),
  orderController.getOrderById,
);
router.put(
  "/:id/cancel",
  validate(orderSchema.orderIdParamSchema),
  orderController.cancelOrder,
);

// ROUTE CỦA ADMIN
router.use(authorize("admin"));
router.get("/", orderController.getAllOrders);
router.put(
  "/:id/status",
  validate(orderSchema.updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

module.exports = router;

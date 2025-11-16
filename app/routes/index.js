const express = require("express");
const router = express.Router();

// Import các tệp route
const authRouter = require("./auth");
const categoryRouter = require("./category");
const brandRouter = require("./brand");
const productRouter = require("./product");
const cartRouter = require("./cart");

// --- PHẦN CẬP NHẬT (Bước 12) ---
// 1. Import tệp route "order" mà chúng ta vừa tạo
const orderRouter = require("./order");

/**
 * Định tuyến (routing) cho các đường dẫn
 */
router.use("/api/auth", authRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/brands", brandRouter);
router.use("/api/products", productRouter);
router.use("/api/cart", cartRouter);

// --- PHẦN CẬP NHẬT (Bước 12) ---
// 2. Khi đường dẫn bắt đầu bằng '/api/orders'
//    thì sử dụng 'orderRouter'
router.use("/api/orders", orderRouter);

// Xuất (export) "Tổng đài" router này ra
module.exports = router;

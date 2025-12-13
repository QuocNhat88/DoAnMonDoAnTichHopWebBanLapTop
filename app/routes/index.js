const express = require("express");
const router = express.Router();

// Import các tệp route
const authRouter = require("./auth");
const categoryRouter = require("./category");
const brandRouter = require("./brand");
const productRouter = require("./product");
const cartRouter = require("./cart");
const userRouter = require("./user");
const statisticsRouter = require("./statistics");
const orderRouter = require("./order");

router.use("/api/auth", authRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/brands", brandRouter);
router.use("/api/products", productRouter);
router.use("/api/cart", cartRouter);
router.use("/api/users", userRouter);
router.use("/api/statistics", statisticsRouter);
router.use("/api/orders", orderRouter);
// Xuất (export) "Tổng đài" router này ra
module.exports = router;

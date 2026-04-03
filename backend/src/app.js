const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// --- Các middleware bảo mật và log ---
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

// --- Middleware phân tích request ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- IMPORT CÁC ROUTE TỪ MODULE ---
const authRoutes = require("./modules/auth/auth.route");
const userRoutes = require("./modules/user/user.route");
const categoryRoutes = require("./modules/category/category.route");
const brandRoutes = require("./modules/brand/brand.route");
const productRoutes = require("./modules/product/product.route");
const cartRoutes = require("./modules/cart/cart.route");
const orderRoutes = require("./modules/order/order.route");
const statisticRoutes = require("./modules/statistic/statistic.route");
// --- ĐĂNG KÝ CÁC ROUTE VỚI APP ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/statistics", statisticRoutes);
// Route test tạm thời để đảm bảo app chạy tốt
app.get("/", (req, res) => {
  res.json({ message: "API đang hoạt động theo chuẩn Modular!" });
});

// Xuất app ra để server.js gọi đến
module.exports = app;

// Dòng 1: Nạp các biến môi trường từ tệp .env
require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const port = process.env.PORT || 3000;

// Import module kết nối cơ sở dữ liệu
const db = require("./app/config/db");
// Gọi hàm connect() để thực hiện kết nối
db.connect();

// --- Các middleware ---
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

// --- Middleware mới (QUAN TRỌNG) ---
// Middleware này của Express để phân tích các request
// có nội dung là JSON (vd: khi bạn Đăng ký, Đăng nhập)
app.use(express.json());
// Middleware để phân tích các request từ form HTML (nếu có)
app.use(express.urlencoded({ extended: true }));

// --- PHẦN CODE CẬP NHẬT ---

// 1. Import "tổng đài" route (tệp app/routes/index.js)
const masterRouter = require("./app/routes");

// 2. Bảo Express sử dụng "tổng đài" này
//    (Tất cả các route của bạn sẽ bắt đầu từ đây)
app.use(masterRouter);

// (Chúng ta xóa route '/' cũ đi vì đã có 'masterRouter' quản lý)
// app.get("/", (req, res) => {
//     res.send("Xin chào! Đây là Express Server của tôi.");
// });

// --- HẾT PHẦN CẬP NHẬT ---

// Khởi động server
app.listen(port, () => {
  console.log(`Ứng dụng đang lắng nghe tại http://localhost:${port}`);
});

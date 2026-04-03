// Nạp các biến môi trường từ tệp .env (lùi lại 1 thư mục vì file này đang ở trong src/)
require("dotenv").config({ path: "../.env" });

const app = require("./app");
const db = require("./configs/db"); // Gọi file cấu hình db bạn vừa tạo ở bước trước

const port = process.env.PORT || 3000;

// Khởi động kết nối Database trước, thành công rồi mới chạy Server
db.connect().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Ứng dụng đang lắng nghe tại http://localhost:${port}`);
  });
});

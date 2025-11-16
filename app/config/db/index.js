const mongoose = require("mongoose");

/**
 * Hàm connect này là một hàm bất đồng bộ (async)
 * Nó sẽ thực hiện kết nối đến cơ sở dữ liệu MongoDB
 */
async function connect() {
  try {
    // Lấy chuỗi kết nối từ biến môi trường (tệp .env)
    // process.env.MONGO_URI chính là 'mongodb://localhost:27017/DoAnMonDoAnTichHop'
    const uri = process.env.MONGO_URI;

    // Kiểm tra xem chuỗi kết nối có tồn tại không
    // (Nếu tệp .env bị sai tên hoặc thiếu, uri sẽ là undefined)
    if (!uri) {
      console.error("Lỗi: Biến môi trường MONGO_URI chưa được đặt.");
      console.error("Vui lòng kiểm tra lại tệp .env (phải có tên là .env)");
      process.exit(1); // Thoát ứng dụng nếu không có chuỗi kết nối
    }

    // Sử dụng Mongoose để kết nối đến cơ sở dữ liệu với chuỗi uri
    // (Từ Mongoose v6, không cần các tùy chọn cũ)
    await mongoose.connect(uri);

    // Nếu kết nối thành công, in ra thông báo
    console.log("Kết nối đến MongoDB thành công!");
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình kết nối, in ra lỗi
    console.error("Kết nối đến MongoDB thất bại:");
    console.error(error.message);

    // Thoát ứng dụng nếu không kết nối được
    process.exit(1);
  }
}

// Xuất (export) hàm connect ra ngoài
// để các tệp khác (như index.js) có thể import và sử dụng
module.exports = { connect };

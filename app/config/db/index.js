const mongoose = require("mongoose");

async function connect() {
  try {
    const uri = process.env.MONGO_URI;

    // THÊM LOG ĐỂ DEBUG
    console.log("=== DEBUG CONNECTION ===");
    console.log("MONGO_URI exists:", !!uri);
    console.log(
      "MONGO_URI first 50 chars:",
      uri ? uri.substring(0, 50) + "..." : "UNDEFINED"
    );
    console.log(
      "Connection type:",
      uri?.includes("localhost") ? "LOCAL" : "ATLAS"
    );
    console.log("========================");

    if (!uri) {
      console.error("Lỗi: Biến môi trường MONGO_URI chưa được đặt.");
      console.error("Vui lòng kiểm tra lại tệp .env");
      process.exit(1);
    }

    await mongoose.connect(uri);

    console.log("✅ Kết nối đến MongoDB thành công!");
    console.log("📦 Database:", mongoose.connection.db.databaseName);
    console.log("🔗 Host:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ Kết nối đến MongoDB thất bại:");
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { connect };

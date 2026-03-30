// Import thư viện 'nodemailer'
const nodemailer = require("nodemailer");

/**
 * --- HÀM GỬI EMAIL ---
 * Đã cấu hình chống lỗi Connection Timeout trên Render
 */
const sendEmail = async (options) => {
  try {
    // 1. Tạo Transporter với cấu hình máy chủ SMTP cụ thể
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Đổi sang cổng 587
      secure: false, // Cổng 587 bắt buộc secure phải là false
      requireTLS: true, // Ép buộc sử dụng mã hóa TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Định nghĩa "Lá thư" (Mail Options)
    const mailOptions = {
      // Tên người gửi hiển thị
      from: `"WebBanLaptop" <${process.env.EMAIL_USER}>`,
      to: options.email, // Email người nhận
      subject: options.subject, // Tiêu đề email
      html: options.message, // Nội dung email (dạng HTML)
    };

    // 3. Thực hiện gửi
    await transporter.sendMail(mailOptions);

    console.log(`Email đã được gửi thành công đến: ${options.email}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error.message);
    // NÉM LỖI ra ngoài để file Controller biết đường báo về Frontend chữ màu đỏ
    throw new Error("Lỗi máy chủ gửi mail: " + error.message);
  }
};

// Xuất hàm để dùng ở nơi khác
module.exports = sendEmail;

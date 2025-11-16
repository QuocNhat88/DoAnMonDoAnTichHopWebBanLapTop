// Import thư viện 'nodemailer' mà chúng ta vừa cài
const nodemailer = require("nodemailer");

/**
 * --- HÀM GỬI EMAIL ---
 * Đây là một hàm "tiện ích" bất đồng bộ
 * Nó nhận vào một "options" (tùy chọn)
 * và gửi email bằng Gmail
 *
 */
const sendEmail = async (options) => {
  try {
    // 1. Tạo "Người vận chuyển" (Transporter)
    // Đây là "cỗ máy" gửi email,
    // nó cần thông tin đăng nhập Gmail của bạn
    const transporter = nodemailer.createTransport({
      // Chúng ta dùng Gmail
      service: "gmail",
      // (Nếu bạn dùng host khác,
      //  cần host, port, secure...)
      auth: {
        // Lấy thông tin từ tệp .env
        // (Đây là lý do chúng ta thêm vào .env)
        user: process.env.EMAIL_USER, // (Email 'nnhat425@gmail.com')
        pass: process.env.EMAIL_PASS, // (Mật khẩu Ứng dụng)
      },
    });

    // 2. Định nghĩa "Lá thư" (Mail Options)
    const mailOptions = {
      // Tên người gửi (bạn có thể đổi tên "WebBanLaptop" tùy ý)
      from: `"WebBanLaptop" <${process.env.EMAIL_USER}>`,
      to: options.email, // Email người nhận (email của user)
      subject: options.subject, // Tiêu đề email
      html: options.message, // Nội dung email (dạng HTML)
    };

    // 3. Gửi "Lá thư"
    await transporter.sendMail(mailOptions);

    console.log("Email đã được gửi thành công!");
    return true;
  } catch (error) {
    // Nếu gửi lỗi (thường là do sai Mật khẩu Ứng dụng)
    console.error("Lỗi khi gửi email:", error.message);
    return false;
  }
};

// Xuất (export) hàm này ra
module.exports = sendEmail;

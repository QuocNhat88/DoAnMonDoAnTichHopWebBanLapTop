/**
 * --- HÀM GỬI EMAIL BẰNG API BREVO ---
 * Cách này dùng cổng HTTPS (443) nên CHẮC CHẮN 100% KHÔNG BỊ TIMEOUT TRÊN RENDER
 */
const sendEmail = async (options) => {
  try {
    // Gọi thẳng lên API của Brevo qua web request
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY, // Mã API bạn vừa dán bên Render
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "LaptopStore - Quoc Nhat",
          email: process.env.EMAIL_USER, // Phải là email bạn dùng đăng ký Brevo (nnhat425@gmail.com)
        },
        to: [
          {
            email: options.email, // Email người dùng nhập trên web
          },
        ],
        subject: options.subject,
        htmlContent: options.message, // Nội dung HTML chứa link đổi mật khẩu
      }),
    });

    // Kiểm tra nếu Brevo báo lỗi (ví dụ sai API Key)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Brevo Error: " + JSON.stringify(errorData));
    }

    console.log(`✅ Tuyệt vời! Đã gửi email thành công tới: ${options.email}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi API Brevo:", error.message);
    // Ném lỗi để Controller báo về Frontend chữ đỏ
    throw new Error("Lỗi hệ thống gửi mail API: " + error.message);
  }
};

module.exports = sendEmail;

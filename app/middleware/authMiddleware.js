// Import thư viện jwt
const jwt = require("jsonwebtoken");
// Import Model User (để tìm user)
const User = require("../models/User");

/**
 * --- MIDDLEWARE BẢO VỆ (protect) ---
 * Middleware này sẽ được "chèn" vào giữa Route và Controller
 * để kiểm tra xem người dùng đã đăng nhập (gửi token) chưa.
 *
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem request có "tiêu đề" (Header) 'Authorization'
  //    Và tiêu đề đó có bắt đầu bằng 'Bearer' không
  //    (Tiêu chuẩn gửi Token là: 'Bearer <token>')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Nếu có, lấy chuỗi Token ra (cắt bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(" ")[1];

      // 3. Xác thực (Verify) Token
      // Dùng "khóa bí mật" (.env) để giải mã token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // 4. Nếu giải mã thành công, "decoded" sẽ chứa payload
      //    (mà chúng ta đã gói ở hàm login: { user: { id, role } })
      // Tìm user trong DB bằng ID từ token
      // GÁN user (trừ password) vào đối tượng req
      // 'req.user' SẼ ĐƯỢC DÙNG Ở TẤT CẢ CÁC BƯỚC SAU (CONTROLLER)
      req.user = await User.findById(decoded.user.id).select("-password");

      // 5. Nếu tìm thấy user, gọi "next()"
      //    "next()" nghĩa là: "OK, hợp lệ, cho đi tiếp đến Controller"
      next();
    } catch (error) {
      // Nếu Token sai (hoặc hết hạn)
      console.error("Token không hợp lệ:", error.message);
      res.status(401).json({
        // 401 = Unauthorized (Chưa xác thực)
        success: false,
        message: "Token không hợp lệ. Vui lòng đăng nhập lại.",
      });
    }
  }

  // 6. Nếu không gửi token (hoặc không có 'Bearer')
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Không có token. Yêu cầu bị từ chối.",
    });
  }
};

/**
 * --- MIDDLEWARE PHÂN QUYỀN (admin) ---
 * Middleware này kiểm tra xem người dùng có phải là Admin không
 * (Nó phải được chạy SAU middleware 'protect' ở trên)
 */
const isAdmin = (req, res, next) => {
  // Lúc này, req.user đã được gán bởi middleware 'protect'
  if (req.user && req.user.role === "admin") {
    // Nếu đúng là admin, cho đi tiếp
    next();
  } else {
    // Nếu không phải, báo lỗi 403 (Forbidden - Cấm)
    res.status(403).json({
      success: false,
      message: "Yêu cầu bị từ chối. Cần quyền Admin.",
    });
  }
};

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  protect,
  isAdmin,
};

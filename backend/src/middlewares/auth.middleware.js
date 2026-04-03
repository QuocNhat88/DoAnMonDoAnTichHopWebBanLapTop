const jwt = require("jsonwebtoken");

// Middleware: Bảo vệ các route yêu cầu đăng nhập
const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem header Authorization có chứa token không (định dạng chuẩn: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Cắt lấy phần token phía sau chữ "Bearer "
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token bằng chữ ký bí mật trong file .env
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Lưu thông tin user (id, role) từ token vào request để các Controller phía sau sử dụng
      req.user = decoded.user;

      return next(); // Cho phép đi qua cổng an ninh
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!",
      });
    }
  }

  // 2. Nếu không tìm thấy token nào
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có quyền truy cập. Vui lòng đăng nhập!",
    });
  }
};

// Middleware: Phân quyền (Ví dụ: Chỉ Admin mới được xóa sản phẩm)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Nếu role của user hiện tại không nằm trong danh sách được phép
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

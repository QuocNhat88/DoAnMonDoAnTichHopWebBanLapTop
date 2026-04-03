const validate = (schema) => (req, res, next) => {
  // 1. Chặn trường hợp quên truyền schema hoặc chưa lưu file schema
  if (!schema) {
    console.error("🔴 Lỗi Server: Schema truyền vào validate() bị undefined!");
    return res.status(500).json({
      success: false,
      message: "Lỗi cấu hình server (Thiếu Schema).",
    });
  }

  // 2. Dùng safeParse để kiểm tra dữ liệu một cách an toàn
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // 3. Nếu dữ liệu KHÔNG hợp lệ
  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      // Lấy tên trường bị lỗi (nằm ở cuối mảng path, ví dụ: 'email')
      field: err.path[err.path.length - 1],
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ",
      errors: formattedErrors,
    });
  }

  // 4. Nếu dữ liệu chuẩn xác, cho phép đi tiếp vào Controller
  next();
};

module.exports = validate;

// Import Model Danh mục
const Category = require("../models/Category");

/**
 * --- HÀM 1: LẤY TẤT CẢ DANH MỤC (GET ALL) ---
 * Logic cho: GET /api/categories
 * Quyền truy cập: Public (Bất kỳ ai)
 */
const getAllCategories = async (req, res) => {
  try {
    // Tìm tất cả danh mục trong DB
    const categories = await Category.find({});

    // Trả về danh sách
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 2: TẠO MỘT DANH MỤC MỚI (CREATE) ---
 * Logic cho: POST /api/categories
 * Quyền truy cập: Private (Chỉ Admin)
 * (Middleware 'protect' và 'isAdmin' sẽ bảo vệ route này)
 */
const createCategory = async (req, res) => {
  try {
    // 1. Lấy "name" và "description" từ body
    const { name, description } = req.body;

    // 2. Kiểm tra xem tên danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục này đã tồn tại.",
      });
    }

    // 3. Tạo danh mục mới
    const newCategory = new Category({
      name: name,
      description: description,
      // (imageUrl có thể thêm sau)
    });

    // 4. Lưu vào DB
    await newCategory.save();

    // 5. Trả về thành công
    res.status(201).json({
      success: true,
      message: "Tạo danh mục mới thành công!",
      data: newCategory,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// (Chúng ta sẽ thêm hàm Cập nhật và Xóa sau)

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  getAllCategories,
  createCategory,
};

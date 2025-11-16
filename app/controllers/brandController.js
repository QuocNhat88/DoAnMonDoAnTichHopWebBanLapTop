// Import Model Thương hiệu
const Brand = require("../models/Brand");

/**
 * --- HÀM 1: LẤY TẤT CẢ THƯƠNG HIỆU (GET ALL) ---
 * Logic cho: GET /api/brands
 * Quyền truy cập: Public (Bất kỳ ai)
 */
const getAllBrands = async (req, res) => {
  try {
    // Tìm tất cả thương hiệu trong DB
    const brands = await Brand.find({});

    // Trả về danh sách
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    // Đã sửa comment
    console.error("Lỗi khi lấy thương hiệu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 2: TẠO MỘT THƯƠNG HIỆU MỚI (CREATE) ---
 * Logic cho: POST /api/brands
 * Quyền truy cập: Private (Chỉ Admin)
 */
const createBrand = async (req, res) => {
  try {
    // 1. Lấy "name" và "description" từ body
    const { name, description } = req.body;

    // 2. Kiểm tra xem tên thương hiệu đã tồn tại chưa
    const existingBrand = await Brand.findOne({ name: name });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Tên thương hiệu này đã tồn tại.",
      });
    }

    // 3. Tạo thương hiệu mới
    const newBrand = new Brand({
      name: name,
      description: description,
      // (logoUrl có thể thêm sau)
    });

    // 4. Lưu vào DB
    await newBrand.save();

    // 5. Trả về thành công
    res.status(201).json({
      success: true,
      message: "Tạo thương hiệu mới thành công!",
      data: newBrand, // (Bạn đã sửa đúng chỗ này, Rất Tốt!)
    });
  } catch (error) {
    // Đã sửa comment
    console.error("Lỗi khi tạo thương hiệu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  getAllBrands,
  createBrand,
};

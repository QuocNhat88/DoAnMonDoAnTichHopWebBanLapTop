// Import Model Thương hiệu
const Brand = require("../models/Brand");
const mongoose = require("mongoose");

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

/**
 * --- HÀM 3: LẤY THƯƠNG HIỆU THEO ID (GET BY ID) ---
 * Logic cho: GET /api/brands/:id
 * Quyền truy cập: Public
 */
const getBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thương hiệu không hợp lệ." });
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thương hiệu." });
    }

    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    console.error("Lỗi khi lấy thương hiệu theo ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 4: CẬP NHẬT THƯƠNG HIỆU (UPDATE) ---
 * Logic cho: PUT /api/brands/:id
 * Quyền truy cập: Private/Admin
 */
const updateBrand = async (req, res) => {
  try {
    const brandId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thương hiệu không hợp lệ." });
    }

    if (updateData.name) {
      const existingBrand = await Brand.findOne({
        name: updateData.name,
        _id: { $ne: brandId },
      });
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Tên thương hiệu này đã tồn tại.",
        });
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBrand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu để cập nhật.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thương hiệu thành công!",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thương hiệu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 5: XÓA THƯƠNG HIỆU (DELETE) ---
 * Logic cho: DELETE /api/brands/:id
 * Quyền truy cập: Private/Admin
 */
const deleteBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID thương hiệu không hợp lệ." });
    }

    const deletedBrand = await Brand.findByIdAndDelete(brandId);

    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thương hiệu để xóa.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa thương hiệu thành công!",
      data: {},
    });
  } catch (error) {
    console.error("Lỗi khi xóa thương hiệu:", error.message);
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
  getBrandById,
  updateBrand,
  deleteBrand,
};

// Import Model Danh mục
const Category = require("../models/Category");
const mongoose = require("mongoose");

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

/**
 * --- HÀM 3: LẤY DANH MỤC THEO ID (GET BY ID) ---
 * Logic cho: GET /api/categories/:id
 * Quyền truy cập: Public
 */
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ." });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục." });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 4: CẬP NHẬT DANH MỤC (UPDATE) ---
 * Logic cho: PUT /api/categories/:id
 * Quyền truy cập: Private/Admin
 */
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ." });
    }

    if (updateData.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Tên danh mục này đã tồn tại.",
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục để cập nhật.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công!",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 5: XÓA DANH MỤC (DELETE) ---
 * Logic cho: DELETE /api/categories/:id
 * Quyền truy cập: Private/Admin
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID danh mục không hợp lệ." });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục để xóa." });
    }

    res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công!",
      data: {},
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

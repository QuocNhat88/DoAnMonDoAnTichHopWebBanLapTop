const categoryService = require("./category.service");

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesService();
    return res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryByIdService(
      req.params.id,
    );
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategoryService(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Tạo danh mục mới thành công!",
        data: newCategory,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategoryService(
      req.params.id,
      req.body,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật danh mục thành công!",
        data: updatedCategory,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategoryService(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Xóa danh mục thành công!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

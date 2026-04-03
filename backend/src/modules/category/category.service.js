const Category = require("./category.model");

const getAllCategoriesService = async () => {
  return await Category.find({});
};

const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Không tìm thấy danh mục.");
  return category;
};

const createCategoryService = async (categoryData) => {
  const existingCategory = await Category.findOne({ name: categoryData.name });
  if (existingCategory) throw new Error("Tên danh mục này đã tồn tại.");

  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

const updateCategoryService = async (categoryId, updateData) => {
  // Nếu có cập nhật tên, kiểm tra xem tên mới có bị trùng với danh mục khác không
  if (updateData.name) {
    const existingCategory = await Category.findOne({
      name: updateData.name,
      _id: { $ne: categoryId },
    });
    if (existingCategory) throw new Error("Tên danh mục này đã tồn tại.");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true, runValidators: true },
  );
  if (!updatedCategory) throw new Error("Không tìm thấy danh mục để cập nhật.");

  return updatedCategory;
};

const deleteCategoryService = async (categoryId) => {
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) throw new Error("Không tìm thấy danh mục để xóa.");
  return deletedCategory;
};

module.exports = {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};

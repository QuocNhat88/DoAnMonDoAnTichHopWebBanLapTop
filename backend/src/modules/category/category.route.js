const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const validate = require("../../middlewares/validate");
const categorySchema = require("./category.schema");

// Import middleware phân quyền bảo vệ
const { protect, authorize } = require("../../middlewares/auth.middleware");

// CÁC API PUBLIC (Ai cũng xem được)
router.get("/", categoryController.getAllCategories);
router.get(
  "/:id",
  validate(categorySchema.categoryIdParamSchema),
  categoryController.getCategoryById,
);

// CÁC API PRIVATE (Chỉ Admin mới có quyền Thêm/Sửa/Xóa)
router.use(protect); // Bắt buộc phải đăng nhập
router.use(authorize("admin")); // Bắt buộc role phải là 'admin'

router.post(
  "/",
  validate(categorySchema.createCategorySchema),
  categoryController.createCategory,
);
router.put(
  "/:id",
  validate(categorySchema.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  validate(categorySchema.categoryIdParamSchema),
  categoryController.deleteCategory,
);

module.exports = router;

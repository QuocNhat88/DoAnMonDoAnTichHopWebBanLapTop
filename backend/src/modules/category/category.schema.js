const { z } = require("zod");

// Hàm kiểm tra ObjectId của MongoDB (dài 24 ký tự hex)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Vui lòng nhập tên danh mục"),
    description: z.string().optional(),
    imageUrl: z.string().url("Đường dẫn ảnh không hợp lệ").optional(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    name: z.string().min(1, "Tên danh mục không được để trống").optional(),
    description: z.string().optional(),
    imageUrl: z.string().url("Đường dẫn ảnh không hợp lệ").optional(),
  }),
});

const categoryIdParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
};

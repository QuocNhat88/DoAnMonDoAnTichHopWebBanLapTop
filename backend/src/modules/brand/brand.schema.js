const { z } = require("zod");

// Hàm kiểm tra ObjectId của MongoDB
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Vui lòng nhập tên thương hiệu"),
    description: z.string().optional(),
    // Nếu model của bạn có thêm logo/image thì mở comment dòng dưới
    // imageUrl: z.string().url("Đường dẫn ảnh không hợp lệ").optional(),
  }),
});

const updateBrandSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    name: z.string().min(1, "Tên thương hiệu không được để trống").optional(),
    description: z.string().optional(),
  }),
});

const brandIdParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

module.exports = {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
};

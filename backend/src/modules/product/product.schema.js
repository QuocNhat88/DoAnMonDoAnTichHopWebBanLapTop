const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    price: z.number().min(0, "Giá không được âm"),
    originalPrice: z.number().min(0).optional(),
    stock: z.number().min(0).default(0),
    category: objectIdSchema,
    brand: objectIdSchema,
    thumbnail: z.string().url("URL ảnh đại diện không hợp lệ"),
    images: z.array(z.string().url()).optional(),
    specifications: z
      .object({
        cpu: z.string().optional(),
        ram: z.string().optional(),
        storage: z.string().optional(),
        display: z.string().optional(),
        gpu: z.string().optional(),
      })
      .optional(),
  }),
});

// Update schema cho phép tất cả các trường thành optional (có thể gửi thiếu)
const updateProductSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: createProductSchema.shape.body.partial(),
});

const productIdParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

// Validate các tham số truy vấn (query params) cho hàm GET ALL
const getProductsQuerySchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    category: objectIdSchema.optional(),
    brand: objectIdSchema.optional(),
    minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  getProductsQuerySchema,
};

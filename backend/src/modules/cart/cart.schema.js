const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const addToCartSchema = z.object({
  body: z.object({
    productId: objectIdSchema,
    quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0"),
  }),
});

const updateCartSchema = z.object({
  body: z.object({
    productId: objectIdSchema,
    newQuantity: z.number().int("Số lượng phải là số nguyên"),
  }),
});

const removeCartSchema = z.object({
  params: z.object({
    productId: objectIdSchema,
  }),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
  removeCartSchema,
};

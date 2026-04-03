const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

const createOrderSchema = z.object({
  body: z.object({
    shippingInfo: z.object({
      fullName: z.string().min(1, "Vui lòng nhập họ tên người nhận"),
      address: z.string().min(1, "Vui lòng nhập địa chỉ giao hàng"),
      phoneNumber: z
        .string()
        .regex(
          /^0\d{9}$/,
          "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)",
        ),
    }),
    paymentMethod: z.enum(["cod", "banking"]),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    status: z.enum(
      ["pending", "processing", "shipped", "delivered", "cancelled"],
      "Trạng thái không hợp lệ",
    ),
  }),
});

const orderIdParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
};

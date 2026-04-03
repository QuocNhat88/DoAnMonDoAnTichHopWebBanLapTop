const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
  }),
});

const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token không hợp lệ"),
  }),
  body: z.object({
    password: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

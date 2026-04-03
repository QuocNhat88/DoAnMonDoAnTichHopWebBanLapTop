const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate");
const authSchema = require("./auth.schema");
const { protect } = require("../../middlewares/auth.middleware");

// CÁC ROUTE CÔNG KHAI
router.post(
  "/register",
  validate(authSchema.registerSchema),
  authController.register,
);
router.post("/login", validate(authSchema.loginSchema), authController.login);
router.post(
  "/forgotpassword",
  validate(authSchema.forgotPasswordSchema),
  authController.forgotPassword,
);
router.put(
  "/resetpassword/:token",
  validate(authSchema.resetPasswordSchema),
  authController.resetPassword,
);

// CÁC ROUTE BẮT BUỘC ĐĂNG NHẬP
router.use(protect);
router.get("/me", authController.getMe);
router.put(
  "/profile",
  validate(authSchema.updateProfileSchema),
  authController.updateUserProfile,
);
router.put(
  "/changepassword",
  validate(authSchema.changePasswordSchema),
  authController.changePassword,
);

module.exports = router;

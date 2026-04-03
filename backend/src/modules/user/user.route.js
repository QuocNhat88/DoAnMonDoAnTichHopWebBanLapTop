const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const validate = require("../../middlewares/validate");
const userSchema = require("./user.schema");
const { protect } = require("../../middlewares/auth.middleware");
// Nếu bạn có middleware phân quyền admin (ví dụ authorize), hãy import vào đây
// const { authorize } = require("../../middlewares/auth.middleware");

// Bảo vệ toàn bộ các route bên dưới (yêu cầu phải đăng nhập)
router.use(protect);

// ----------------------------------------------------
// CÁC ROUTE CỦA ADMIN (Thêm mới vào đây)
// ----------------------------------------------------
// GET /api/users/ - Lấy tất cả user (Nên thêm middleware authorize('admin') nếu có)
router.get("/", userController.getAllUsers);

// DELETE /api/users/:id - Xóa user
router.delete("/:id", userController.deleteUser);

// ----------------------------------------------------
// CÁC ROUTE CỦA CÁ NHÂN (USER)
// ----------------------------------------------------
// GET /api/users/me
router.get("/me", userController.getMe);

// PUT /api/users/profile
router.put(
  "/profile",
  validate(userSchema.updateProfileSchema),
  userController.updateProfile,
);

module.exports = router;

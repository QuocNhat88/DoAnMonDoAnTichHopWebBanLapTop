const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const validate = require("../../middlewares/validate");
const cartSchema = require("./cart.schema");
const { protect } = require("../../middlewares/auth.middleware");

// TẤT CẢ API giỏ hàng đều yêu cầu đăng nhập
router.use(protect);

router.get("/", cartController.getMyCart);
router.post(
  "/",
  validate(cartSchema.addToCartSchema),
  cartController.addToCart,
);
router.put(
  "/",
  validate(cartSchema.updateCartSchema),
  cartController.updateCartItemQuantity,
);
router.delete(
  "/:productId",
  validate(cartSchema.removeCartSchema),
  cartController.removeCartItem,
);

module.exports = router;

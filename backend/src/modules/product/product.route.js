const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const validate = require("../../middlewares/validate");
const productSchema = require("./product.schema");
const { protect, authorize } = require("../../middlewares/auth.middleware");

// CÁC API PUBLIC
router.get(
  "/",
  validate(productSchema.getProductsQuerySchema),
  productController.getAllProducts,
);
router.get(
  "/:id",
  validate(productSchema.productIdParamSchema),
  productController.getProductById,
);

// CÁC API PRIVATE (Chỉ Admin)
router.use(protect);
router.use(authorize("admin"));

router.post(
  "/",
  validate(productSchema.createProductSchema),
  productController.createProduct,
);
router.put(
  "/:id",
  validate(productSchema.updateProductSchema),
  productController.updateProduct,
);
router.delete(
  "/:id",
  validate(productSchema.productIdParamSchema),
  productController.deleteProduct,
);

module.exports = router;

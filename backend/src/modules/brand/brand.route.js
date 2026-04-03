const express = require("express");
const router = express.Router();
const brandController = require("./brand.controller");
const validate = require("../../middlewares/validate");
const brandSchema = require("./brand.schema");

const { protect, authorize } = require("../../middlewares/auth.middleware");

// CÁC API PUBLIC (Ai cũng xem được)
router.get("/", brandController.getAllBrands);
router.get(
  "/:id",
  validate(brandSchema.brandIdParamSchema),
  brandController.getBrandById,
);

// CÁC API PRIVATE (Chỉ Admin)
router.use(protect);
router.use(authorize("admin"));

router.post(
  "/",
  validate(brandSchema.createBrandSchema),
  brandController.createBrand,
);
router.put(
  "/:id",
  validate(brandSchema.updateBrandSchema),
  brandController.updateBrand,
);
router.delete(
  "/:id",
  validate(brandSchema.brandIdParamSchema),
  brandController.deleteBrand,
);

module.exports = router;

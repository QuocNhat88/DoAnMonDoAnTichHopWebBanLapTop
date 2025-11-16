const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Tạo Khuôn mẫu (Schema) cho Thương hiệu (Brand)
 */
const BrandSchema = new Schema(
  {
    // Tên thương hiệu (ví dụ: "Dell", "Asus", "HP")
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Mô tả về thương hiệu
    description: {
      type: String,
      trim: true,
    },
    // Logo của thương hiệu (lưu URL)
    logoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Tạo Model từ Schema
 * Mongoose sẽ tự động tìm bộ sưu tập 'brands' (viết thường, số nhiều)
 */
const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;

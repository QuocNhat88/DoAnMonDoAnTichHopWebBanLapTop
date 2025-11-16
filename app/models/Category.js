const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Tạo Khuôn mẫu (Schema) cho Danh mục (Category)
 */
const CategorySchema = new Schema(
  {
    // Tên danh mục (ví dụ: "Laptop Gaming", "Laptop Văn phòng")
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Mô tả ngắn
    description: {
      type: String,
      trim: true,
    },
    // Ảnh đại diện cho danh mục (lưu URL)
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Tạo Model từ Schema
 * Mongoose sẽ tự động tìm bộ sưu tập 'categories' (viết thường, số nhiều)
 */
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;

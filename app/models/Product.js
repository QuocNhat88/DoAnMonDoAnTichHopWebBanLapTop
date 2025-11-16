const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Tạo Khuôn mẫu (Schema) cho Sản phẩm (Product)
 */
const ProductSchema = new Schema(
  {
    // Tên sản phẩm
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Mô tả chi tiết (HTML hoặc Markdown)
    description: {
      type: String,
      required: true,
    },
    // Giá bán
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Giá gốc (nếu có giảm giá)
    originalPrice: {
      type: Number,
      min: 0,
    },
    // Số lượng trong kho
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // --- Liên kết với các Model khác ---

    // Liên kết đến Danh mục (1 sản phẩm thuộc 1 danh mục)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Tham chiếu đến Model 'Category'
      required: true,
    },
    // Liên kết đến Thương hiệu (1 sản phẩm thuộc 1 thương hiệu)
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand", // Tham chiếu đến Model 'Brand'
      required: true,
    },

    // --- Thông tin khác ---

    // Mảng các URL hình ảnh
    images: [
      {
        type: String,
      },
    ],
    // Ảnh đại diện chính
    thumbnail: {
      type: String,
      required: true,
    },

    // Đối tượng chứa các thông số kỹ thuật
    // (Linh hoạt, bạn có thể thêm bớt: CPU, RAM, SSD...)
    specifications: {
      cpu: { type: String },
      ram: { type: String },
      storage: { type: String }, // Ổ cứng
      display: { type: String }, // Màn hình
      gpu: { type: String }, // Card đồ họa
      // ... (thêm các thông số khác nếu cần)
    },

    // Đánh giá (tính trung bình)
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    // Số lượng đánh giá
    numReviews: {
      type: Number,
      default: 0,
    },
    // (Bạn có thể tạo Model 'Review' riêng nếu muốn làm chi tiết)
  },
  {
    timestamps: true,
  }
);

/**
 * Tạo Model từ Schema
 * Mongoose sẽ tự động tìm bộ sưu tập 'products'
 */
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

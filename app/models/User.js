// Import thư viện mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Định nghĩa cấu trúc cho một 'cartItem' (mặt hàng trong giỏ)
 * (ĐÂY LÀ PHẦN ĐÃ SỬA LỖI)
 */
const CartItemSchema = new Schema(
  {
    // Liên kết đến sản phẩm
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // --- DÒNG MỚI ĐƯỢC THÊM VÀO ---
    // (Chúng ta lưu tên ở đây để 'Order' có thể "sao chép")
    name: {
      type: String,
      required: true,
    },
    // Số lượng
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải lớn hơn 0"],
      default: 1,
    },
    // Giá tại thời điểm thêm vào giỏ
    price: {
      type: Number,
      required: true,
    },
  },
  {
    // _id: false
  }
);

/**
 * Tạo Khuôn mẫu (Schema) cho User (Người dùng)
 */
const UserSchema = new Schema(
  {
    // Tên đăng nhập
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Mật khẩu (sẽ được mã hóa)
    password: {
      type: String,
      required: true,
    },
    // Tên đầy đủ
    fullName: {
      type: String,
      required: false,
    },
    // Địa chỉ
    address: {
      type: String,
      required: false,
    },
    // Số điện thoại
    phoneNumber: {
      type: String,
      required: false,
    },
    // Phân quyền (người dùng thường hay admin)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Giỏ hàng là một MẢNG các CartItemSchema (đã được sửa)
    cart: [CartItemSchema],

    // (Tùy chọn: Thêm token để reset mật khẩu)
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo Model từ Schema
const User = mongoose.model("User", UserSchema);

// Xuất (export) Model ra
module.exports = User;

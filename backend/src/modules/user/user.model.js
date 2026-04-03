const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải lớn hơn 0"],
      default: 1,
    },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: { type: String, required: true, unique: true, trim: true },

    // ĐỔI THÀNH FALSE: Vì đăng nhập bằng Google sẽ không có password
    password: { type: String, required: false },

    // THÊM 2 TRƯỜNG MỚI CHO GOOGLE OAUTH
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },

    fullName: { type: String, required: false },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: [CartItemSchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);

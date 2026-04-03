const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    // --- CẬP NHẬT PHẦN NÀY ---
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "banking"], // Thêm banking
      default: "cod",
    },
    // Thêm trường xác nhận đã thanh toán chưa
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;

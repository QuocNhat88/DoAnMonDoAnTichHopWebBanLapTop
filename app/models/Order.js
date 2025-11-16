const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Tạo Khuôn mẫu (Schema) cho Đơn hàng (Order)
 */
const OrderSchema = new Schema(
  {
    // --- Người mua hàng ---
    // Liên kết đến người dùng đã đặt hàng
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến Model 'User'
      required: true,
    },

    // --- Các mặt hàng đã mua ---
    // Sao chép lại cấu trúc của CartItem
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        // Lưu lại ID sản phẩm để có thể nhấn vào xem lại
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    // --- Thông tin vận chuyển ---
    shippingInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },

    // --- Thông tin thanh toán ---
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "paypal", "vnpay"], // Ví dụ
      default: "cod", // Thanh toán khi nhận hàng
    },
    paymentResult: {
      // Lưu kết quả nếu thanh toán online
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    // --- Tổng tiền ---
    itemsPrice: {
      // Tổng tiền hàng
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      // Phí vận chuyển
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      // Thuế (nếu có)
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      // Tổng cộng cuối cùng
      type: Number,
      required: true,
      default: 0.0,
    },

    // --- Trạng thái đơn hàng ---
    status: {
      type: String,
      required: true,
      enum: [
        "pending", // Đang chờ xử lý
        "processing", // Đang xử lý
        "shipped", // Đang vận chuyển
        "delivered", // Đã giao hàng
        "cancelled", // Đã hủy
      ],
      default: "pending",
    },

    // --- Thời gian (để tiện truy vấn) ---
    paidAt: {
      // Thời gian thanh toán
      type: Date,
    },
    deliveredAt: {
      // Thời gian giao hàng thành công
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt (thời gian đặt hàng)
  }
);

/**
 * Tạo Model từ Schema
 * Mongoose sẽ tự động tìm bộ sưu tập 'orders'
 */
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

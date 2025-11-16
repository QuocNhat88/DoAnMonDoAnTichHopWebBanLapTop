// ... (Import models Order, User, Product, mongoose)
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// --- HÀM 1: CREATE ORDER (Bạn đã có) ---
const createOrder = async (req, res) => {
  // ... (Toàn bộ code "Đặt hàng" của bạn ở đây) ...
  try {
    const { shippingInfo, paymentMethod } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const cart = user.cart;
    if (cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Giỏ hàng của bạn đang rỗng." });
    }
    for (const item of cart) {
      const product = await Product.findById(item.product);
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Sản phẩm "${product.name}" không đủ hàng.`,
          });
      }
    }
    const itemsPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = 0.0;
    const shippingPrice = 0.0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const newOrder = new Order({
      user: userId,
      orderItems: cart,
      shippingInfo: shippingInfo,
      paymentMethod: paymentMethod,
      itemsPrice: itemsPrice,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
    });
    await newOrder.save();
    for (const item of cart) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }
    user.cart = [];
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Đặt hàng thành công!", data: newOrder });
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 2: GET MY ORDERS (Bạn đã có) ---
const getMyOrders = async (req, res) => {
  // ... (Code lấy đơn hàng của TÔI) ...
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng của tôi:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 3: GET ORDER BY ID (Bạn đã có) ---
const getOrderById = async (req, res) => {
  // ... (Code lấy 1 đơn hàng) ...
  try {
    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID đơn hàng không hợp lệ." });
    }
    const order = await Order.findById(orderId).populate(
      "user",
      "username email"
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }
    if (
      req.user.role === "admin" ||
      order.user._id.toString() === req.user.id
    ) {
      res.status(200).json({ success: true, data: order });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Không có quyền xem đơn hàng này." });
    }
  } catch (error) {
    console.error("Lỗi khi lấy 1 đơn hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 4: GET ALL ORDERS (ADMIN) (Bạn đã có) ---
const getAllOrders = async (req, res) => {
  // ... (Code lấy TẤT CẢ đơn hàng) ...
  try {
    const orders = await Order.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 5: UPDATE ORDER STATUS (ADMIN) (Bạn đã có) ---
const updateOrderStatus = async (req, res) => {
  // ... (Code Admin cập nhật trạng thái) ...
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Trạng thái "${status}" không hợp lệ.`,
        });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }
    order.status = status;
    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công!",
        data: order,
      });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- PHẦN CẬP NHẬT (THÊM 1 HÀM MỚI) ---

/**
 * --- HÀM 6: HỦY ĐƠN HÀNG (USER) ---
 * Logic cho: PUT /api/orders/:id/cancel
 * Quyền truy cập: Private (User)
 */
const cancelOrder = async (req, res) => {
  try {
    // 1. "Bảo vệ" protect đã chạy, ta có req.user.id
    const userId = req.user.id;
    // 2. Lấy ID đơn hàng từ params
    const orderId = req.params.id;

    // 3. Tìm đơn hàng
    const order = await Order.findById(orderId);

    // 4. Kiểm tra (Validation)
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    // KIỂM TRA QUYỀN SỞ HỮU (Quan trọng!)
    if (order.user.toString() !== userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Bạn không có quyền hủy đơn hàng này.",
        });
    }

    // KIỂM TRA TRẠNG THÁI (Quan trọng!)
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng đang ở trạng thái "${order.status}", không thể hủy.`,
      });
    }

    // 5. Mọi thứ OK -> Hủy đơn hàng
    order.status = "cancelled";

    // 6. HOÀN KHO (Rất quan trọng!)
    // Trả lại số lượng hàng cho 'stock'
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        // $inc (increment) với giá trị dương
        $inc: { stock: +item.quantity },
      });
    }

    // 7. Lưu lại
    await order.save();

    // 8. Trả về thành công
    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- Xuất (Export) CẢ 6 HÀM ra ---
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder, // (Hàm mới)
};

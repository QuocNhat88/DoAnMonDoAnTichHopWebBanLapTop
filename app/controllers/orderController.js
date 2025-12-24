const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

/**
 * --- HÀM 1: TẠO ĐƠN HÀNG (CREATE ORDER) ---
 * Xử lý cả COD và Banking (chờ thanh toán)
 */
const createOrder = async (req, res) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;
    const userId = req.user.id; // Lấy từ token xác thực

    // 1. Lấy thông tin User và Giỏ hàng
    const user = await User.findById(userId);
    const cart = user.cart;

    if (!cart || cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Giỏ hàng của bạn đang rỗng." });
    }

    // 2. Kiểm tra tồn kho (Stock)
    for (const item of cart) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Sản phẩm không tồn tại." });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" không đủ hàng (chỉ còn ${product.stock}).`,
        });
      }
    }

    // 3. Tính toán tiền
    const itemsPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = 0; // Tùy chỉnh thuế
    const shippingPrice = 0; // Tùy chỉnh ship
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // 4. Tạo đơn hàng mới
    const newOrder = new Order({
      user: userId,
      orderItems: cart,
      shippingInfo: shippingInfo,
      paymentMethod: paymentMethod, // 'cod' hoặc 'banking'
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      // Mặc định là chưa thanh toán
      isPaid: false,
      status: "pending",
    });

    // 5. Lưu đơn hàng
    await newOrder.save();

    // 6. Trừ tồn kho (Stock)
    for (const item of cart) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 7. Xóa giỏ hàng của User
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

/**
 * --- HÀM 2: LẤY ĐƠN HÀNG CỦA TÔI (GET MY ORDERS) ---
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    // Sắp xếp đơn mới nhất lên đầu
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng của tôi:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

/**
 * --- HÀM 3: LẤY CHI TIẾT 1 ĐƠN HÀNG (GET ORDER BY ID) ---
 */
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID đơn hàng không hợp lệ." });
    }

    const order = await Order.findById(orderId).populate(
      "user",
      "username email fullName"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    // Kiểm tra quyền: Admin hoặc Chính chủ mới được xem
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Không có quyền xem đơn hàng này." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

/**
 * --- HÀM 4: LẤY TẤT CẢ ĐƠN HÀNG (ADMIN ONLY) ---
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("Lỗi lấy tất cả đơn hàng:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

/**
 * --- HÀM 5: CẬP NHẬT TRẠNG THÁI GIAO HÀNG (ADMIN ONLY) ---
 */
const updateOrderStatus = async (req, res) => {
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
        .json({ success: false, message: "Trạng thái không hợp lệ." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    order.status = status;

    // Nếu giao thành công -> cập nhật thời gian deliveredAt
    if (status === "delivered") {
      order.deliveredAt = Date.now();
      // Nếu là COD và giao thành công -> coi như đã thanh toán
      if (order.paymentMethod === "cod") {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    await order.save();
    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công!",
      data: order,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

/**
 * --- HÀM 6: HỦY ĐƠN HÀNG (USER/ADMIN) ---
 * Có hoàn lại số lượng tồn kho (Restock)
 */
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    // Kiểm tra quyền (Chính chủ hoặc Admin)
    if (req.user.role !== "admin" && order.user.toString() !== userId) {
      return res
        .status(401)
        .json({ success: false, message: "Bạn không có quyền hủy đơn này." });
    }

    // Chỉ hủy được khi đang chờ xử lý
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng đã được xử lý, không thể hủy.",
      });
    }

    order.status = "cancelled";

    // --- HOÀN KHO (RESTOCK) ---
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: +item.quantity },
      });
    }

    await order.save();
    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

/**
 * --- HÀM 7: WEBHOOK XỬ LÝ THANH TOÁN TỰ ĐỘNG (CASSO) ---
 * Nhận dữ liệu từ Casso khi có biến động số dư
 */
const webhookCasso = async (req, res) => {
  try {
    console.log("\n=== WEBHOOK CASSO RECEIVED ===");
    console.log("⏰ Time:", new Date().toISOString());
    console.log("📋 Headers:", JSON.stringify(req.headers, null, 2));
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    console.log("================================\n");

    // 1. Kiểm tra Secure Token
    const secureToken = req.headers["secure-token"];
    const expectedToken = process.env.CASSO_SECURE_TOKEN;

    if (secureToken !== expectedToken) {
      console.log("❌ Token không khớp!");
      console.log("Nhận được:", secureToken);
      console.log("Mong đợi:", expectedToken);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("✅ Token hợp lệ");

    // 2. Kiểm tra dữ liệu
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      console.log("❌ Dữ liệu không hợp lệ hoặc không phải array");
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    console.log(`📊 Số lượng giao dịch: ${data.length}`);

    // 3. Xử lý từng giao dịch
    for (let i = 0; i < data.length; i++) {
      const transaction = data[i];
      console.log(`\n--- Giao dịch ${i + 1}/${data.length} ---`);
      console.log("ID:", transaction.id);
      console.log("Số tiền:", transaction.amount);
      console.log("Nội dung:", transaction.description);
      console.log("Thời gian:", transaction.when);

      const { description, amount, id, when } = transaction;

      // Tìm Order ID (chuỗi 24 ký tự hex)
      const orderIdMatch = description.match(/[0-9a-fA-F]{24}/);

      if (!orderIdMatch) {
        console.log("⚠️ Không tìm thấy Order ID trong nội dung");
        continue;
      }

      const orderId = orderIdMatch[0];
      console.log("🔍 Tìm thấy Order ID:", orderId);

      const order = await Order.findById(orderId);

      if (!order) {
        console.log("❌ Không tìm thấy đơn hàng trong database");
        continue;
      }

      console.log("✅ Đơn hàng tồn tại:");
      console.log("  - Tổng tiền đơn:", order.totalPrice);
      console.log("  - Đã thanh toán:", order.isPaid);
      console.log("  - Số tiền nhận:", amount);

      if (order.isPaid) {
        console.log("ℹ️ Đơn hàng đã thanh toán trước đó, bỏ qua");
        continue;
      }

      if (amount >= order.totalPrice) {
        console.log("💰 Số tiền hợp lệ, đang cập nhật đơn hàng...");

        order.isPaid = true;
        order.paidAt = new Date(when);
        order.paymentResult = {
          id: String(id),
          status: "completed",
          update_time: when,
          method: "vietqr_casso",
        };

        await order.save();
        console.log("✅ Cập nhật đơn hàng thành công!");
      } else {
        console.log("⚠️ Số tiền không đủ:");
        console.log(`   Cần: ${order.totalPrice}, Nhận: ${amount}`);
      }
    }

    console.log("\n=== KẾT THÚC XỬ LÝ WEBHOOK ===\n");
    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("\n❌❌❌ LỖI WEBHOOK ❌❌❌");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("============================\n");
    return res.status(200).json({ success: true, message: "Error handled" });
  }
};
// --- XUẤT MODULE ---
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  webhookCasso, // Đừng quên xuất hàm này
};

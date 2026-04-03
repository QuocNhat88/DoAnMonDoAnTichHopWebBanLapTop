const Order = require("./order.model");
const User = require("../user/user.model");
const Product = require("../product/product.model");

const createOrderService = async (userId, orderData) => {
  const { shippingInfo, paymentMethod } = orderData;
  const user = await User.findById(userId);
  const cart = user.cart;

  if (!cart || cart.length === 0)
    throw new Error("Giỏ hàng của bạn đang rỗng.");

  // Kiểm tra tồn kho
  for (const item of cart) {
    const product = await Product.findById(item.product);
    if (!product)
      throw new Error(`Sản phẩm với ID ${item.product} không tồn tại.`);
    if (product.stock < item.quantity) {
      throw new Error(
        `Sản phẩm "${product.name}" không đủ hàng (chỉ còn ${product.stock}).`,
      );
    }
  }

  // Tính tiền
  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxPrice = 0;
  const shippingPrice = 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Tạo đơn hàng
  const newOrder = new Order({
    user: userId,
    orderItems: cart,
    shippingInfo,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: false,
    status: "pending",
  });

  await newOrder.save();

  // Trừ tồn kho
  for (const item of cart) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Xóa giỏ hàng
  user.cart = [];
  await user.save();

  return newOrder;
};

const getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

const getOrderByIdService = async (orderId, userId, userRole) => {
  const order = await Order.findById(orderId).populate(
    "user",
    "username email fullName",
  );
  if (!order) throw new Error("Không tìm thấy đơn hàng.");

  if (userRole !== "admin" && order.user._id.toString() !== userId) {
    throw new Error("Không có quyền xem đơn hàng này.");
  }
  return order;
};

const getAllOrdersService = async () => {
  return await Order.find({})
    .populate("user", "username email")
    .sort({ createdAt: -1 });
};

const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng.");

  order.status = status;
  if (status === "delivered") {
    order.deliveredAt = Date.now();
    if (order.paymentMethod === "cod") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
  }
  return await order.save();
};

const cancelOrderService = async (orderId, userId, userRole) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng.");

  if (userRole !== "admin" && order.user.toString() !== userId) {
    throw new Error("Bạn không có quyền hủy đơn này.");
  }

  if (order.status !== "pending") {
    throw new Error("Đơn hàng đã được xử lý, không thể hủy.");
  }

  order.status = "cancelled";

  // Hoàn kho (Restock)
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: +item.quantity },
    });
  }

  return await order.save();
};

const processWebhookService = async (data) => {
  for (const transaction of data) {
    const { description, amount, id, when } = transaction;
    const orderIdMatch = description.match(/[0-9a-fA-F]{24}/);

    if (!orderIdMatch) continue;

    const orderId = orderIdMatch[0];
    const order = await Order.findById(orderId);

    if (!order || order.isPaid) continue;

    if (amount >= order.totalPrice) {
      order.isPaid = true;
      order.paidAt = new Date(when);
      order.paymentResult = {
        id: String(id),
        status: "completed",
        update_time: when,
        method: "vietqr_casso",
      };
      await order.save();
    }
  }
};

module.exports = {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
  cancelOrderService,
  processWebhookService,
};

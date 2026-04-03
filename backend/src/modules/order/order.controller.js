const orderService = require("./order.service");

const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrderService(
      req.user.id,
      req.body,
    );
    return res
      .status(201)
      .json({ success: true, message: "Đặt hàng thành công!", data: newOrder });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getMyOrdersService(req.user.id);
    return res
      .status(200)
      .json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderByIdService(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrdersService();
    return res
      .status(200)
      .json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderStatusService(
      req.params.id,
      req.body.status,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật trạng thái thành công!",
        data: updatedOrder,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const cancelledOrder = await orderService.cancelOrderService(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Hủy đơn hàng thành công!",
        data: cancelledOrder,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const webhookCasso = async (req, res) => {
  try {
    const secureToken = req.headers["secure-token"];
    if (secureToken !== process.env.CASSO_SECURE_TOKEN) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.body.data || !Array.isArray(req.body.data)) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    await orderService.processWebhookService(req.body.data);
    return res
      .status(200)
      .json({ success: true, message: "Webhook received and processed" });
  } catch (error) {
    console.error("Lỗi Webhook:", error.message);
    return res
      .status(200)
      .json({ success: true, message: "Error handled gracefully" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  webhookCasso,
};

const Order = require("../order/order.model");
const User = require("../user/user.model");
const Product = require("../product/product.model");

const getOverviewService = async () => {
  const totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  const totalOrders = await Order.countDocuments();
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const outOfStockProducts = await Product.countDocuments({ stock: 0 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRevenue = await Order.aggregate([
    { $match: { status: "delivered", deliveredAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const todayRevenueAmount =
    todayRevenue.length > 0 ? todayRevenue[0].total : 0;

  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: today },
  });

  return {
    revenue: { total: revenue, today: todayRevenueAmount },
    orders: {
      total: totalOrders,
      delivered: deliveredOrders,
      pending: pendingOrders,
      today: todayOrders,
    },
    users: { total: totalUsers },
    products: { total: totalProducts, outOfStock: outOfStockProducts },
  };
};

const getRevenueService = async (query) => {
  const { period = "month", startDate, endDate } = query;
  let matchQuery = { status: "delivered" };

  if (startDate && endDate) {
    matchQuery.deliveredAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else {
    const now = new Date();
    let start;
    switch (period) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    matchQuery.deliveredAt = { $gte: start };
  }

  const revenueData = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: "$totalPrice" },
      },
    },
  ]);

  const dailyRevenue = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    period,
    totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
    totalOrders: revenueData.length > 0 ? revenueData[0].totalOrders : 0,
    averageOrderValue:
      revenueData.length > 0 ? revenueData[0].averageOrderValue : 0,
    dailyRevenue,
  };
};

const getOrdersByStatusService = async () => {
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { count: -1 } },
  ]);
  return ordersByStatus.map((item) => ({
    status: item._id,
    count: item.count,
    totalRevenue: item.totalRevenue,
  }));
};

const getTopProductsService = async (limitQuery) => {
  const limit = parseInt(limitQuery) || 10;
  return await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        productName: "$product.name",
        productPrice: "$product.price",
        productThumbnail: "$product.thumbnail",
        totalSold: 1,
        totalRevenue: 1,
        orderCount: 1,
      },
    },
  ]);
};

const getUserStatisticsService = async () => {
  const totalUsers = await User.countDocuments();
  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const newUsersThisWeek = await User.countDocuments({
    createdAt: { $gte: startOfWeek },
  });

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const newUsersToday = await User.countDocuments({
    createdAt: { $gte: startOfDay },
  });

  return {
    total: totalUsers,
    byRole: usersByRole.map((item) => ({ role: item._id, count: item.count })),
    newUsers: {
      today: newUsersToday,
      thisWeek: newUsersThisWeek,
      thisMonth: newUsersThisMonth,
    },
  };
};

const getRevenueByPaymentMethodService = async () => {
  const revenueByPayment = await Order.aggregate([
    { $match: { status: "delivered" } },
    {
      $group: {
        _id: "$paymentMethod",
        totalRevenue: { $sum: "$totalPrice" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);
  return revenueByPayment.map((item) => ({
    paymentMethod: item._id,
    totalRevenue: item.totalRevenue,
    orderCount: item.orderCount,
  }));
};

module.exports = {
  getOverviewService,
  getRevenueService,
  getOrdersByStatusService,
  getTopProductsService,
  getUserStatisticsService,
  getRevenueByPaymentMethodService,
};

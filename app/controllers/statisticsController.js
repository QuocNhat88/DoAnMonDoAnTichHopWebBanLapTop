// Import Models
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

/**
 * --- HÀM 1: TỔNG QUAN THỐNG KÊ (OVERVIEW) ---
 * Logic cho: GET /api/statistics/overview
 * Quyền truy cập: Private/Admin
 */
const getOverview = async (req, res) => {
  try {
    // 1. Tổng doanh thu (chỉ tính đơn hàng đã giao - delivered)
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // 2. Tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // 3. Đơn hàng đã giao
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    // 4. Đơn hàng đang chờ xử lý
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // 5. Tổng số người dùng
    const totalUsers = await User.countDocuments();

    // 6. Tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // 7. Sản phẩm hết hàng (stock = 0)
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // 8. Doanh thu hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          deliveredAt: { $gte: today },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const todayRevenueAmount =
      todayRevenue.length > 0 ? todayRevenue[0].total : 0;

    // 9. Đơn hàng hôm nay
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: revenue,
          today: todayRevenueAmount,
        },
        orders: {
          total: totalOrders,
          delivered: deliveredOrders,
          pending: pendingOrders,
          today: todayOrders,
        },
        users: {
          total: totalUsers,
        },
        products: {
          total: totalProducts,
          outOfStock: outOfStockProducts,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy tổng quan thống kê:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 2: DOANH THU THEO THỜI GIAN ---
 * Logic cho: GET /api/statistics/revenue
 * Quyền truy cập: Private/Admin
 * Query: period (day/week/month/year), startDate, endDate
 */
const getRevenue = async (req, res) => {
  try {
    const { period = "month", startDate, endDate } = req.query;

    let matchQuery = { status: "delivered" };

    // Nếu có startDate và endDate
    if (startDate && endDate) {
      matchQuery.deliveredAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Nếu không có, lấy theo period
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

    // Tính tổng doanh thu
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

    // Lấy chi tiết từng ngày (nếu period = day hoặc có date range)
    const dailyRevenue = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = {
      period: period,
      totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
      totalOrders: revenueData.length > 0 ? revenueData[0].totalOrders : 0,
      averageOrderValue:
        revenueData.length > 0 ? revenueData[0].averageOrderValue : 0,
      dailyRevenue: dailyRevenue,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 3: ĐƠN HÀNG THEO TRẠNG THÁI ---
 * Logic cho: GET /api/statistics/orders-by-status
 * Quyền truy cập: Private/Admin
 */
const getOrdersByStatus = async (req, res) => {
  try {
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

    // Format lại dữ liệu
    const formattedData = ordersByStatus.map((item) => ({
      status: item._id,
      count: item.count,
      totalRevenue: item.totalRevenue,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo trạng thái:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 4: SẢN PHẨM BÁN CHẠY ---
 * Logic cho: GET /api/statistics/top-products
 * Quyền truy cập: Private/Admin
 * Query: limit (số lượng sản phẩm, mặc định: 10)
 */
const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Tính số lượng bán được của từng sản phẩm
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } }, // Không tính đơn hàng đã hủy
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

    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 5: THỐNG KÊ NGƯỜI DÙNG ---
 * Logic cho: GET /api/statistics/users
 * Quyền truy cập: Private/Admin
 */
const getUserStatistics = async (req, res) => {
  try {
    // Tổng số user
    const totalUsers = await User.countDocuments();

    // Số user theo role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // User mới trong tháng này
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // User mới trong tuần này
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    // User mới hôm nay
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // Format usersByRole
    const formattedRoleData = usersByRole.map((item) => ({
      role: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        byRole: formattedRoleData,
        newUsers: {
          today: newUsersToday,
          thisWeek: newUsersThisWeek,
          thisMonth: newUsersThisMonth,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê người dùng:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 6: DOANH THU THEO PHƯƠNG THỨC THANH TOÁN ---
 * Logic cho: GET /api/statistics/revenue-by-payment
 * Quyền truy cập: Private/Admin
 */
const getRevenueByPaymentMethod = async (req, res) => {
  try {
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

    const formattedData = revenueByPayment.map((item) => ({
      paymentMethod: item._id,
      totalRevenue: item.totalRevenue,
      orderCount: item.orderCount,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error(
      "Lỗi khi lấy doanh thu theo phương thức thanh toán:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- Xuất (Export) các hàm này ra ---
module.exports = {
  getOverview,
  getRevenue,
  getOrdersByStatus,
  getTopProducts,
  getUserStatistics,
  getRevenueByPaymentMethod,
};

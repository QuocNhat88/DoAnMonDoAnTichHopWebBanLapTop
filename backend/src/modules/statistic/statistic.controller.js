const statisticService = require("./statistic.service");

const getOverview = async (req, res) => {
  try {
    const data = await statisticService.getOverviewService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const data = await statisticService.getRevenueService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const data = await statisticService.getOrdersByStatusService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const data = await statisticService.getTopProductsService(req.query.limit);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const data = await statisticService.getUserStatisticsService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenueByPaymentMethod = async (req, res) => {
  try {
    const data = await statisticService.getRevenueByPaymentMethodService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOverview,
  getRevenue,
  getOrdersByStatus,
  getTopProducts,
  getUserStatistics,
  getRevenueByPaymentMethod,
};

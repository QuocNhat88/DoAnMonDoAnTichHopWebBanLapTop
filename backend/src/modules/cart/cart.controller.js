const cartService = require("./cart.service");

const getMyCart = async (req, res) => {
  try {
    const cart = await cartService.getMyCartService(req.user.id);
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cart = await cartService.addToCartService(req.user.id, req.body);
    return res
      .status(200)
      .json({
        success: true,
        message: "Thêm vào giỏ hàng thành công!",
        data: cart,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const cart = await cartService.updateCartItemQuantityService(
      req.user.id,
      req.body,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật số lượng thành công",
        data: cart,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cart = await cartService.removeCartItemService(
      req.user.id,
      req.params.productId,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng",
        data: cart,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
};

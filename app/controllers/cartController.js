// Import Model User (vì giỏ hàng nằm trong User)
const User = require("../models/User");
// Import Model Product (để lấy giá và kiểm tra kho)
const Product = require("../models/Product");
// Import mongoose để kiểm tra ObjectId
const mongoose = require("mongoose");

/**
 * --- HÀM 1: LẤY GIỎ HÀNG CỦA TÔI (GET MY CART) ---
 * (Hàm này đã đúng, không đổi)
 */
const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "cart.product",
      select: "name price thumbnail stock",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 2: THÊM VÀO GIỎ HÀNG (ADD TO CART) ---
 * (Hàm này đã được SỬA LỖI)
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm.",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm không đủ số lượng trong kho.",
      });
    }

    const user = await User.findById(userId);

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      let item = user.cart[itemIndex];
      item.quantity += quantity;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Tổng số lượng trong giỏ vượt quá số hàng trong kho.",
        });
      }
      user.cart[itemIndex] = item;
    } else {
      // --- ĐÃ SỬA LỖI Ở ĐÂY ---
      // Thêm "name: product.name" vào cartItem
      const cartItem = {
        product: productId,
        name: product.name, // <--- DÒNG MỚI ĐỂ SỬA LỖI
        quantity: quantity,
        price: product.price,
      };
      user.cart.push(cartItem);
    }

    await user.save();

    const populatedUser = await User.findById(userId).populate(
      "cart.product",
      "name price thumbnail stock"
    );

    res.status(200).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công!",
      data: populatedUser.cart,
    });
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

/**
 * --- HÀM 3: CẬP NHẬT SỐ LƯỢNG (UPDATE QUANTITY) ---
 * (Hàm này đã được SỬA LỖI)
 */
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const userId = req.user.id;

    if (newQuantity <= 0) {
      // Nếu số lượng mới là 0, gọi "Xóa"
      // (Chúng ta sẽ "mượn" logic của hàm 'removeCartItem'
      //  bằng cách giả lập req, res)
      const mockReq = { params: { productId }, user: { id: userId } };
      const mockRes = {
        status: (code) => ({
          json: (data) => res.status(code).json(data),
        }),
      };
      return removeCartItem(mockReq, mockRes);
    }

    const product = await Product.findById(productId);
    if (product.stock < newQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "Số lượng vượt quá hàng trong kho." });
    }

    const user = await User.findById(userId);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = newQuantity;
      user.cart[itemIndex].price = product.price;
      // --- ĐÃ SỬA LỖI Ở ĐÂY ---
      // Thêm "name" khi cập nhật (phòng hờ)
      user.cart[itemIndex].name = product.name; // <--- DÒNG MỚI

      await user.save();

      const populatedUser = await User.findById(userId).populate(
        "cart.product",
        "name price thumbnail stock"
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật số lượng thành công",
          data: populatedUser.cart,
        });
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy sản phẩm trong giỏ.",
        });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

/**
 * --- HÀM 4: XÓA SẢN PHẨM KHỎI GIỎ (REMOVE ITEM) ---
 * (Hàm này đã đúng, không đổi)
 */
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart.pull(user.cart[itemIndex]._id);
      await user.save();

      const populatedUser = await User.findById(userId).populate(
        "cart.product",
        "name price thumbnail stock"
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Đã xóa sản phẩm khỏi giỏ hàng",
          data: populatedUser.cart,
        });
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy sản phẩm trong giỏ.",
        });
    }
  } catch (error) {
    console.error("Lỗi khi xóa khỏi giỏ hàng:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- Xuất (Export) CẢ 4 HÀM ra ---
module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
};

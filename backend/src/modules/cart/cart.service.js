const User = require("../user/user.model");
const Product = require("../product/product.model");

// Hàm hỗ trợ: Lấy giỏ hàng đã được điền chi tiết sản phẩm (populate)
const getPopulatedCart = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name price thumbnail stock",
  });
  return user.cart;
};

const getMyCartService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng.");
  return await getPopulatedCart(userId);
};

const addToCartService = async (userId, data) => {
  const { productId, quantity } = data;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  if (product.stock < quantity)
    throw new Error("Sản phẩm không đủ số lượng trong kho.");

  const user = await User.findById(userId);
  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    // Nếu sản phẩm đã có trong giỏ -> Cộng dồn số lượng
    let item = user.cart[itemIndex];
    item.quantity += quantity;
    if (product.stock < item.quantity) {
      throw new Error("Tổng số lượng trong giỏ vượt quá số hàng trong kho.");
    }
    user.cart[itemIndex] = item;
  } else {
    // Nếu sản phẩm chưa có trong giỏ -> Thêm mới
    user.cart.push({
      product: productId,
      name: product.name,
      quantity: quantity,
      price: product.price,
    });
  }

  await user.save();
  return await getPopulatedCart(userId);
};

const updateCartItemQuantityService = async (userId, data) => {
  const { productId, newQuantity } = data;

  // Nếu số lượng cập nhật <= 0, chuyển sang hàm xóa
  if (newQuantity <= 0) {
    return await removeCartItemService(userId, productId);
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  if (product.stock < newQuantity)
    throw new Error("Số lượng vượt quá hàng trong kho.");

  const user = await User.findById(userId);
  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity = newQuantity;
    user.cart[itemIndex].price = product.price; // Cập nhật lại giá nhỡ có thay đổi
    user.cart[itemIndex].name = product.name;
    await user.save();
    return await getPopulatedCart(userId);
  } else {
    throw new Error("Không tìm thấy sản phẩm trong giỏ.");
  }
};

const removeCartItemService = async (userId, productId) => {
  const user = await User.findById(userId);

  // Dùng filter để giữ lại các sản phẩm KHÁC với productId cần xóa
  const initialLength = user.cart.length;
  user.cart = user.cart.filter((item) => item.product.toString() !== productId);

  if (user.cart.length === initialLength) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ.");
  }

  await user.save();
  return await getPopulatedCart(userId);
};

module.exports = {
  getMyCartService,
  addToCartService,
  updateCartItemQuantityService,
  removeCartItemService,
};

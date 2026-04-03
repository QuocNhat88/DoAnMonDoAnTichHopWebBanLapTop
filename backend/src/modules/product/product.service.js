const Product = require("./product.model");

const getAllProductsService = async (queryData) => {
  const { keyword, category, brand, minPrice, maxPrice } = queryData;
  let query = {};

  if (keyword) query.name = { $regex: keyword, $options: "i" };
  if (category) query.category = category;
  if (brand) query.brand = brand;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .populate("brand", "name")
    .sort({ createdAt: -1 });

  return products;
};

const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate("brand", "name");

  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  return product;
};

const createProductService = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const updateProductService = async (productId, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true },
  );
  if (!updatedProduct) throw new Error("Không tìm thấy sản phẩm để cập nhật.");
  return updatedProduct;
};

const deleteProductService = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) throw new Error("Không tìm thấy sản phẩm để xóa.");
  return deletedProduct;
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};

const Product = require("./product.model"); // Đã sửa lại đường dẫn cho đúng cấu trúc modular của bạn
const mongoose = require("mongoose");

// --- 1. LẤY TẤT CẢ SẢN PHẨM ---
const getAllProducts = async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice } = req.query;

    let query = {};

    if (keyword && keyword.trim() !== "") {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category && category !== "" && category !== "undefined") {
      query.category = category;
    }

    if (brand && brand !== "" && brand !== "undefined") {
      query.brand = brand;
    }

    if ((minPrice && minPrice !== "") || (maxPrice && maxPrice !== "")) {
      query.price = {};
      if (minPrice && minPrice !== "") query.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== "") query.price.$lte = Number(maxPrice);
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

// --- 2. LẤY CHI TIẾT 1 SẢN PHẨM ---
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("brand", "name");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm." });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

// --- 3. TẠO MỚI SẢN PHẨM ---
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Tạo sản phẩm thành công!",
        data: newProduct,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 4. CẬP NHẬT SẢN PHẨM ---
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm." });
    res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật thành công!",
        data: updatedProduct,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 5. XÓA SẢN PHẨM ---
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm." });
    res
      .status(200)
      .json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

// QUAN TRỌNG: Phải xuất đủ tất cả các hàm này ra
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

// ... (Import models)
const Product = require("../models/Product");
const mongoose = require("mongoose");

/**
 * --- HÀM 1: LẤY TẤT CẢ SẢN PHẨM (GET ALL) ---
 * (Hàm này đã được "nâng cấp" với chức năng TÌM KIẾM)
 */

const getAllProducts = async (req, res) => {
  try {
    // 1. Lấy các tham số từ URL
    // Ví dụ: ?keyword=dell&category=ID_ABC&minPrice=1000000&maxPrice=5000000
    const { keyword, category, brand, minPrice, maxPrice } = req.query;

    console.log("-------------------------------");
    console.log("🔥 Filter nhận được từ Frontend:");
    console.log("Keyword:", keyword);
    console.log("Category:", category);
    console.log("Brand:", brand);
    console.log("Price:", minPrice, " - ", maxPrice);

    // 2. Tạo một object chứa các điều kiện tìm kiếm
    let query = {};

    // - Tìm theo tên (như cũ)
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    // - Lọc theo Danh mục (nếu có gửi lên)
    if (category) {
      query.category = category;
    }

    // - Lọc theo Thương hiệu (nếu có gửi lên)
    if (brand) {
      query.brand = brand;
    }

    // - Lọc theo Giá (Khoảng giá)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // Lớn hơn hoặc bằng min
      if (maxPrice) query.price.$lte = Number(maxPrice); // Nhỏ hơn hoặc bằng max
    }

    // 3. Gọi Database với bộ lọc vừa tạo
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

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

// --- HÀM 2: CREATE PRODUCT (Bạn đã có - Không đổi) ---
const createProduct = async (req, res) => {
  // ... (Code của bạn)
  try {
    const productData = req.body;
    const newProduct = new Product({ ...productData });
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm mới thành công!",
      data: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Đã xảy ra lỗi server. Có thể Category ID hoặc Brand ID không đúng.",
    });
  }
};

// --- HÀM 3: GET PRODUCT BY ID (Bạn đã có - Không đổi) ---
const getProductById = async (req, res) => {
  // ... (Code của bạn)
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ." });
    }
    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("brand", "name");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm." });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Lỗi khi lấy 1 sản phẩm:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 4: UPDATE PRODUCT (Bạn đã có - Không đổi) ---
const updateProduct = async (req, res) => {
  // ... (Code của bạn)
  try {
    const productId = req.params.id;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ." });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server. Có thể Category/Brand ID không đúng.",
    });
  }
};

// --- HÀM 5: DELETE PRODUCT (Bạn đã có - Không đổi) ---
const deleteProduct = async (req, res) => {
  // ... (Code của bạn)
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ." });
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm để xóa." });
    }
    res
      .status(200)
      .json({ success: true, message: "Xóa sản phẩm thành công!", data: {} });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// --- HÀM 6: UPDATE ORDER STATUS (Bạn đã có - Không đổi) ---
// (Lưu ý: Bạn đặt hàm này ở orderController.js,
//  tôi viết lại đây để đảm bảo code của bạn không bị mất)
// *** Vui lòng kiểm tra lại! ***
// *** Hàm này nằm ở tệp orderController.js ***
// const updateOrderStatus = ... (Hàm này ở tệp KHÁC)

// --- Xuất (Export) CẢ 5 HÀM ra ---
module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  // (Bỏ updateOrderStatus ra khỏi đây, nó thuộc về Order)
};

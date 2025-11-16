// ... (Import models)
const Product = require("../models/Product");
const mongoose = require("mongoose");

/**
 * --- HÀM 1: LẤY TẤT CẢ SẢN PHẨM (GET ALL) ---
 * (Hàm này đã được "nâng cấp" với chức năng TÌM KIẾM)
 */
const getAllProducts = async (req, res) => {
  try {
    // --- PHẦN CẬP NHẬT (Tìm kiếm) ---
    // 1. Tạo một "keyword" (từ khóa)
    //    Lấy từ "tham số truy vấn" (query parameter) tên là 'keyword'
    //    (VD: /api/products?keyword=dell)
    const keyword = req.query.keyword
      ? {
          // 2. Nếu có keyword:
          name: {
            $regex: req.query.keyword, // Tìm từ khóa
            $options: "i", // 'i' = không phân biệt hoa/thường
          },
        }
      : {}; // 3. Nếu không có keyword: Dùng object rỗng {}

    // --- HẾT PHẦN CẬP NHẬT ---

    // 4. Thay vì Product.find({})
    //    Chúng ta dùng Product.find({ ...keyword })
    //    (Nếu keyword là {}, nó sẽ tìm tất cả)
    //    (Nếu keyword là { name: ... }, nó sẽ tìm theo tên)
    const products = await Product.find({ ...keyword })
      .populate("category", "name")
      .populate("brand", "name");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server.",
    });
  }
};

// --- HÀM 2: CREATE PRODUCT (Bạn đã có - Không đổi) ---
const createProduct = async (req, res) => {
  // ... (Code của bạn)
  try {
    const productData = req.body;
    const newProduct = new Product({ ...productData });
    await newProduct.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Tạo sản phẩm mới thành công!",
        data: newProduct,
      });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error.message);
    res
      .status(500)
      .json({
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
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy sản phẩm để cập nhật.",
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật sản phẩm thành công!",
        data: updatedProduct,
      });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    res
      .status(500)
      .json({
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

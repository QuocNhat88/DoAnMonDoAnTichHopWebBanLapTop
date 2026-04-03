const brandService = require("./brand.service");

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrandsService();
    return res
      .status(200)
      .json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandByIdService(req.params.id);
    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const newBrand = await brandService.createBrandService(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Tạo thương hiệu mới thành công!",
        data: newBrand,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const updatedBrand = await brandService.updateBrandService(
      req.params.id,
      req.body,
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật thương hiệu thành công!",
        data: updatedBrand,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrandService(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Xóa thương hiệu thành công!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};

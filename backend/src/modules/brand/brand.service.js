const Brand = require("./brand.model");

const getAllBrandsService = async () => {
  return await Brand.find({});
};

const getBrandByIdService = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Không tìm thấy thương hiệu.");
  return brand;
};

const createBrandService = async (brandData) => {
  const existingBrand = await Brand.findOne({ name: brandData.name });
  if (existingBrand) throw new Error("Tên thương hiệu này đã tồn tại.");

  const newBrand = new Brand(brandData);
  return await newBrand.save();
};

const updateBrandService = async (brandId, updateData) => {
  if (updateData.name) {
    const existingBrand = await Brand.findOne({
      name: updateData.name,
      _id: { $ne: brandId },
    });
    if (existingBrand) throw new Error("Tên thương hiệu này đã tồn tại.");
  }

  const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedBrand) throw new Error("Không tìm thấy thương hiệu để cập nhật.");

  return updatedBrand;
};

const deleteBrandService = async (brandId) => {
  const deletedBrand = await Brand.findByIdAndDelete(brandId);
  if (!deletedBrand) throw new Error("Không tìm thấy thương hiệu để xóa.");
  return deletedBrand;
};

module.exports = {
  getAllBrandsService,
  getBrandByIdService,
  createBrandService,
  updateBrandService,
  deleteBrandService,
};

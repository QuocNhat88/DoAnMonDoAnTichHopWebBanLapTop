// src/pages/admin/AdminProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import brandApi from "../../api/brandApi";

function AdminProductForm() {
  const { id } = useParams(); // Lấy ID nếu đang sửa
  const navigate = useNavigate();
  const isEditMode = !!id; // Nếu có ID là chế độ Sửa

  // Dữ liệu dropdown
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "", // Đây là cái quan trọng nhất để sửa lỗi filter
    brand: "",
    description: "",
    thumbnail: "",
  });

  // 1. Tải danh mục & thương hiệu khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      const [catRes, brandRes] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll(),
      ]);
      setCategories(catRes.data || catRes);
      setBrands(brandRes.data || brandRes);

      // Nếu đang sửa, tải thông tin sản phẩm cũ điền vào form
      if (isEditMode) {
        const productRes = await productApi.get(id);
        const p = productRes.data || productRes;

        setFormData({
          name: p.name,
          price: p.price,
          stock: p.stock,
          // Lấy ID của category (nếu p.category là object thì lấy ._id)
          category: p.category?._id || p.category,
          brand: p.brand?._id || p.brand,
          description: p.description,
          thumbnail: p.thumbnail,
        });
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý Lưu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await productApi.update(id, formData);
        alert("Cập nhật thành công!");
      } else {
        await productApi.add(formData);
        alert("Thêm mới thành công!");
      }
      navigate("/admin/products"); // Quay về danh sách
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Tên sản phẩm</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Giá</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Kho</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Thương hiệu</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Link Ảnh (URL)</label>
          <input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          {formData.thumbnail && (
            <img
              src={formData.thumbnail}
              className="h-20 mt-2 object-cover"
              alt="Preview"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 w-full"
        >
          {isEditMode ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
        </button>
      </form>
    </div>
  );
}

export default AdminProductForm;

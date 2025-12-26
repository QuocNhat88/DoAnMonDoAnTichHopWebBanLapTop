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
    category: "",
    brand: "",
    description: "",
    thumbnail: "",
    // --- THÊM PHẦN CẤU HÌNH ---
    specifications: {
      cpu: "",
      ram: "",
      storage: "", // Ổ cứng
      display: "", // Màn hình
      gpu: "", // Card đồ họa
    },
  });

  // 1. Tải danh mục & thương hiệu khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
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
            name: p.name || "",
            price: p.price || 0,
            stock: p.stock || 0,
            category: p.category?._id || p.category || "",
            brand: p.brand?._id || p.brand || "",
            description: p.description || "",
            thumbnail: p.thumbnail || "",
            // Load cấu hình cũ lên (nếu có), nếu không có thì để rỗng
            specifications: {
              cpu: p.specifications?.cpu || "",
              ram: p.specifications?.ram || "",
              storage: p.specifications?.storage || "",
              display: p.specifications?.display || "",
              gpu: p.specifications?.gpu || "",
            },
          });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Xử lý khi nhập liệu thông thường
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- XỬ LÝ RIÊNG CHO CẤU HÌNH (Nested Object) ---
  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value, // Cập nhật đúng trường (cpu, ram...)
      },
    }));
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
    <div className="bg-white p-8 rounded shadow max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- PHẦN 1: THÔNG TIN CƠ BẢN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Tên sản phẩm
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              required
              placeholder="Ví dụ: Laptop Dell XPS 13..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Kho (Số lượng)
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
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
            <label className="block text-gray-700 font-semibold mb-2">
              Thương hiệu
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
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

        {/* --- PHẦN 2: CẤU HÌNH CHI TIẾT (MỚI THÊM) --- */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            ⚙️ Cấu hình chi tiết
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 text-sm">
                Vi xử lý (CPU)
              </label>
              <input
                name="cpu"
                value={formData.specifications.cpu}
                onChange={handleSpecsChange}
                placeholder="VD: Intel Core i7 12700H"
                className="w-full border p-2 rounded focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm">RAM</label>
              <input
                name="ram"
                value={formData.specifications.ram}
                onChange={handleSpecsChange}
                placeholder="VD: 16GB DDR5"
                className="w-full border p-2 rounded focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm">
                Ổ cứng (Storage)
              </label>
              <input
                name="storage"
                value={formData.specifications.storage}
                onChange={handleSpecsChange}
                placeholder="VD: 512GB SSD NVMe"
                className="w-full border p-2 rounded focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm">
                Card màn hình (VGA/GPU)
              </label>
              <input
                name="gpu"
                value={formData.specifications.gpu}
                onChange={handleSpecsChange}
                placeholder="VD: NVIDIA RTX 3060 6GB"
                className="w-full border p-2 rounded focus:border-blue-500"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-600 mb-1 text-sm">
                Màn hình (Display)
              </label>
              <input
                name="display"
                value={formData.specifications.display}
                onChange={handleSpecsChange}
                placeholder="VD: 15.6 inch FHD 144Hz"
                className="w-full border p-2 rounded focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* --- PHẦN 3: HÌNH ẢNH & MÔ TẢ --- */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Link Ảnh (URL)
          </label>
          <input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            required
            placeholder="https://..."
          />
          {formData.thumbnail && (
            <div className="mt-3">
              <span className="text-sm text-gray-500 block mb-1">
                Xem trước:
              </span>
              <img
                src={formData.thumbnail}
                className="h-32 object-contain border rounded p-1"
                alt="Preview"
                onError={(e) => (e.target.style.display = "none")} // Ẩn nếu link lỗi
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Nhập mô tả sản phẩm..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 w-full transition-colors text-lg shadow-md"
        >
          {isEditMode ? "LƯU THAY ĐỔI" : "TẠO SẢN PHẨM MỚI"}
        </button>
      </form>
    </div>
  );
}

export default AdminProductForm;

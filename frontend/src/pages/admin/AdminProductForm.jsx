// src/pages/admin/AdminProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import brandApi from "../../api/brandApi";

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
    thumbnail: "",
    specifications: {
      cpu: "",
      ram: "",
      storage: "",
      display: "",
      gpu: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll(),
        ]);
        setCategories(catRes.data || catRes);
        setBrands(brandRes.data || brandRes);

        if (isEditMode) {
          const productRes = await productApi.get(id);
          const p = productRes.data || productRes;
          setFormData({
            name: p.name || "",
            price: p.price || "",
            stock: p.stock || "",
            category: p.category?._id || p.category || "",
            brand: p.brand?._id || p.brand || "",
            description: p.description || "",
            thumbnail: p.thumbnail || "",
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await productApi.update(id, formData);
        alert("🎉 Cập nhật thành công!");
      } else {
        await productApi.add(formData);
        alert("🎉 Thêm mới thành công!");
      }
      navigate("/admin/products");
    } catch (error) {
      alert("❌ Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Đang tải biểu mẫu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link
              to="/admin/products"
              className="hover:text-blue-600 transition-colors"
            >
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {isEditMode ? "Chỉnh sửa" : "Thêm mới"}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Chỉnh sửa Laptop" : "Thêm Laptop mới"}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isEditMode ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}
          </button>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* --- CỘT TRÁI (RỘNG) --- */}
        <div className="xl:col-span-2 space-y-8">
          {/* Box 1: Thông tin chung */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Thông tin chung
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Laptop Dell XPS 13 9320..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập bài viết giới thiệu sản phẩm..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all custom-scrollbar resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Box 2: Thông số kỹ thuật */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Cấu hình phần cứng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Vi xử lý (CPU)
                </label>
                <input
                  name="cpu"
                  value={formData.specifications.cpu}
                  onChange={handleSpecsChange}
                  placeholder="VD: Intel Core i7 12700H"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Bộ nhớ (RAM)
                </label>
                <input
                  name="ram"
                  value={formData.specifications.ram}
                  onChange={handleSpecsChange}
                  placeholder="VD: 16GB LPDDR5 5200MHz"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Lưu trữ (Storage)
                </label>
                <input
                  name="storage"
                  value={formData.specifications.storage}
                  onChange={handleSpecsChange}
                  placeholder="VD: 512GB SSD NVMe M.2"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Card đồ họa (GPU)
                </label>
                <input
                  name="gpu"
                  value={formData.specifications.gpu}
                  onChange={handleSpecsChange}
                  placeholder="VD: NVIDIA RTX 3050Ti 4GB"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Màn hình (Display)
                </label>
                <input
                  name="display"
                  value={formData.specifications.display}
                  onChange={handleSpecsChange}
                  placeholder="VD: 15.6 inch FHD (1920x1080) 144Hz IPS"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI (HẸP) --- */}
        <div className="space-y-8">
          {/* Box 3: Hình ảnh */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4">Hình ảnh</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  URL Ảnh đại diện <span className="text-red-500">*</span>
                </label>
                <input
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Vùng Preview Ảnh */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-2 h-48 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group">
                {formData.thumbnail ? (
                  <>
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400">
                      <svg
                        className="w-8 h-8 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        Link ảnh bị lỗi
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-10 h-10 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Box 4: Phân loại & Giá */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4">
              Tổ chức & Giá bán
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Giá bán <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 font-bold">
                      ₫
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right .5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`,
                  }}
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right .5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`,
                  }}
                >
                  <option value="" disabled>
                    -- Chọn thương hiệu --
                  </option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;

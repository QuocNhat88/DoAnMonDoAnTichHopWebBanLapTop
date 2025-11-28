// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import brandApi from "../api/brandApi";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dữ liệu cho bộ lọc
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // State lưu trạng thái lọc hiện tại
  const [filter, setFilter] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  // Lấy keyword từ URL (do Header tìm kiếm)
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // 1. Tải danh sách Danh mục & Thương hiệu (Chạy 1 lần đầu)
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll(),
        ]);
        setCategories(catRes.data || catRes);
        setBrands(brandRes.data || brandRes);
      } catch (error) {
        console.log("Lỗi tải danh mục/thương hiệu:", error);
      }
    };
    fetchMetaData();
  }, []);

  // 2. Tải sản phẩm (Chạy khi filter thay đổi hoặc keyword thay đổi)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Gom tất cả điều kiện lại
        const params = {
          keyword: keyword || "",
          category: filter.category,
          brand: filter.brand,
          minPrice: filter.minPrice,
          maxPrice: filter.maxPrice,
        };

        const response = await productApi.getAll(params);
        setProducts(response.data || response.products || []);
      } catch (error) {
        console.log("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, filter]); // Theo dõi sự thay đổi của keyword và filter

  // Hàm xử lý khi chọn bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xóa bộ lọc
  const clearFilter = () => {
    setFilter({ category: "", brand: "", minPrice: "", maxPrice: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Banner Quảng cáo */}
      {!keyword && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Công Nghệ Đỉnh Cao - Giá Cực Tốt
            </h1>
            <p className="text-lg opacity-90">
              Săn ngay laptop gaming, văn phòng giảm giá tới 30%
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Tiêu đề kết quả tìm kiếm */}
        {keyword && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Kết quả tìm kiếm cho:{" "}
            <span className="text-blue-600">"{keyword}"</span>
          </h2>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* --- CỘT TRÁI: BỘ LỌC (SIDEBAR) --- */}
          <div className="w-full md:w-1/4 h-fit bg-white p-5 rounded-lg shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-lg text-gray-800">
                Bộ lọc tìm kiếm
              </h3>
              <button
                onClick={clearFilter}
                className="text-xs text-red-500 hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            {/* 1. Lọc theo Danh mục */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-700">Danh mục</h4>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="w-full border rounded p-2 text-sm focus:outline-blue-500"
              >
                <option value="">-- Tất cả danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Lọc theo Thương hiệu */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-700">Thương hiệu</h4>
              <select
                name="brand"
                value={filter.brand}
                onChange={handleFilterChange}
                className="w-full border rounded p-2 text-sm focus:outline-blue-500"
              >
                <option value="">-- Tất cả thương hiệu --</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Lọc theo Giá */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-700">Khoảng giá</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Từ"
                  value={filter.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded p-2 text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Đến"
                  value={filter.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: DANH SÁCH SẢN PHẨM --- */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
                      <img
                        src={
                          product.thumbnail || "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badge giảm giá (Ví dụ) */}
                      {product.originalPrice > product.price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Giảm giá
                        </span>
                      )}
                    </div>

                    {/* Thông tin */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {product.brand?.name} • {product.category?.name}
                      </div>

                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                        <Link to={`/products/${product._id}`}>
                          {product.name}
                        </Link>
                      </h3>

                      {/* Giá tiền */}
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-red-600">
                            {product.price?.toLocaleString("vi-VN")} đ
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.originalPrice?.toLocaleString("vi-VN")} đ
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/products/${product._id}`}
                          className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
                <button
                  onClick={clearFilter}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

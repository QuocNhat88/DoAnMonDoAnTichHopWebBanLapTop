// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import brandApi from "../api/brandApi";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MỚI: QUẢN LÝ SỐ LƯỢNG HIỂN THỊ ---
  const [visibleCount, setVisibleCount] = useState(12); // Mặc định hiện 12 cái
  // ---------------------------------------------

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filter, setFilter] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // 1. Tải danh mục & thương hiệu
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
        console.log("Lỗi tải metadata:", error);
      }
    };
    fetchMetaData();
  }, []);

  // 2. Tải sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: keyword || "",
          category: filter.category,
          brand: filter.brand,
          minPrice: filter.minPrice,
          maxPrice: filter.maxPrice,
        };
        const response = await productApi.getAll(params);
        setProducts(response.data || response.products || []);

        // --- QUAN TRỌNG: RESET SỐ LƯỢNG VỀ 12 KHI LỌC/TÌM KIẾM ---
        setVisibleCount(12);
        // --------------------------------------------------------
      } catch (error) {
        console.log("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, filter]);

  // Xử lý bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // --- HÀM XỬ LÝ NÚT XEM THÊM ---
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Mỗi lần bấm hiện thêm 8 cái
  };
  // ------------------------------

  // Component Card (Giữ nguyên cho đẹp)
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 p-4 flex items-center justify-center bg-gray-50 overflow-hidden rounded-t-lg">
        <img
          src={product.thumbnail || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -15%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 uppercase font-semibold tracking-wider">
          {product.brand?.name}
        </div>
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm h-10 group-hover:text-blue-600">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-lg font-bold text-red-600">
              {product.price?.toLocaleString("vi-VN")} đ
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through mb-1">
                {product.originalPrice?.toLocaleString("vi-VN")} đ
              </span>
            )}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md text-sm font-bold hover:bg-blue-600 hover:text-white transition"
          >
            Mua Ngay
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner & Hero (Chỉ hiện khi không tìm kiếm) */}
      {!keyword && (
        <div className="bg-white pb-8">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-2xl p-8 md:p-16 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                  Săn Sale Cuối Năm <br /> Laptop Giá Hủy Diệt
                </h1>
                <p className="text-lg text-blue-100 mb-8">
                  Hàng chính hãng, bảo hành tận nơi. Giảm thêm 500k cho học sinh
                  sinh viên.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("shop-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg"
                >
                  Mua Ngay Kẻo Lỡ
                </button>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING SECTION */}
      <div id="shop-section" className="container mx-auto px-4 py-8">
        {keyword ? (
          <h2 className="text-2xl font-bold mb-6">Tìm kiếm: "{keyword}"</h2>
        ) : (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-3">
              Tất cả sản phẩm
            </h2>
            <span className="text-gray-500 text-sm">
              {products.length} sản phẩm
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR LỌC */}
          <div className="w-full md:w-1/5 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">
                Danh mục
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filter.category === ""}
                    onChange={handleFilterChange}
                  />
                  Tất cả
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat._id}
                      checked={filter.category === cat._id}
                      onChange={handleFilterChange}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">
                Thương hiệu
              </h3>
              <select
                name="brand"
                value={filter.brand}
                onChange={handleFilterChange}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">
                Khoảng giá
              </h3>
              <div className="space-y-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Từ (đ)"
                  value={filter.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Đến (đ)"
                  value={filter.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <button
                onClick={() =>
                  setFilter({
                    category: "",
                    brand: "",
                    minPrice: "",
                    maxPrice: "",
                  })
                }
                className="w-full mt-3 bg-gray-200 text-gray-700 text-xs py-2 rounded hover:bg-gray-300"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* DANH SÁCH SẢN PHẨM (MAIN) */}
          <div className="w-full md:w-4/5">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* --- CHỈ HIỂN THỊ SỐ LƯỢNG GIỚI HẠN (Visible Count) --- */}
                  {products.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* --- NÚT XEM THÊM --- */}
                {/* Chỉ hiện nút nếu số lượng hiển thị nhỏ hơn tổng sản phẩm */}
                {visibleCount < products.length && (
                  <div className="text-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      className="bg-white border border-blue-600 text-blue-600 px-8 py-2 rounded-full font-bold hover:bg-blue-600 hover:text-white transition shadow-sm"
                    >
                      Xem thêm {products.length - visibleCount} sản phẩm nữa
                      &darr;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded border">
                <p className="text-gray-500">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

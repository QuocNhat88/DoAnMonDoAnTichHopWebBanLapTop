// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";
import brandApi from "../api/brandApi";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
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
        setVisibleCount(12);
      } catch (error) {
        console.log("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const topCategories = categories.slice(0, 6);
  const featuredBrands = brands.slice(0, 5);

  // --- COMPONENT CARD ĐÃ ĐƯỢC LỘT XÁC ---
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group overflow-hidden">
      {/* Khung ảnh sản phẩm */}
      <div className="relative aspect-square p-6 flex items-center justify-center bg-gray-50/50 group-hover:bg-white transition-colors duration-300">
        <img
          src={product.thumbnail || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Giảm giá
          </span>
        )}
      </div>

      {/* Nội dung sản phẩm */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[11px] text-gray-400 mb-1.5 uppercase font-bold tracking-widest">
          {product.brand?.name || "Thương hiệu"}
        </div>
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors h-10">
          <Link
            to={`/products/${product._id}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            <div className="text-lg font-black text-red-600">
              {product.price?.toLocaleString("vi-VN")} đ
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 line-through mt-0.5">
                {product.originalPrice?.toLocaleString("vi-VN")} đ
              </div>
            )}
          </div>

          <Link
            to={`/products/${product._id}`}
            className="relative z-10 flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
            title="Xem chi tiết"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* HERO SECTION - Giao diện Header to */}
      {!keyword && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="text-center lg:text-left">
                <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                  Mừng Lễ Giáng Sinh · Giảm đến 40%
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                  Laptop chính hãng <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    cho mọi nhu cầu
                  </span>
                </h1>
                <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                  Đặt hàng online giao nhanh trong 2h, hỗ trợ đổi trả 7 ngày và
                  bảo hành tận nhà toàn quốc. Trải nghiệm công nghệ đỉnh cao
                  ngay hôm nay.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() =>
                      document
                        .getElementById("shop-section")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                  >
                    Xem ưu đãi hôm nay
                  </button>
                  <button className="px-8 py-3.5 rounded-full border-2 border-gray-200 font-bold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors">
                    Tư vấn miễn phí
                  </button>
                </div>

                {/* Thống kê nhỏ */}
                <div className="mt-12 grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-8 max-w-2xl mx-auto lg:mx-0">
                  <div>
                    <p className="text-3xl font-black text-gray-900">
                      {products.length || 250}+
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-semibold">
                      Mẫu Laptop
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">24/7</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-semibold">
                      Hỗ trợ
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">4.8/5</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-semibold">
                      Đánh giá
                    </p>
                  </div>
                </div>
              </div>

              {/* Ảnh Banner Bên Phải */}
              <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 blur-3xl opacity-20 rounded-full"></div>
                <div className="relative bg-gray-900 rounded-[2rem] p-6 shadow-2xl border border-gray-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gray-800 rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
                      alt="Laptop showroom"
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-white">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">
                        Đổi trả 7 ngày
                      </p>
                      <p className="text-lg font-bold">Miễn phí</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">
                        Giao hàng
                      </p>
                      <p className="text-lg font-bold">Siêu tốc 2H</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TẤT CẢ PHẦN DƯỚI ĐƯỢC BỌC TRONG max-w-7xl ĐỂ CĂN GIỮA ĐẸP TRÊN PC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DANH MỤC NỔI BẬT */}
        {!keyword && topCategories.length > 0 && (
          <section className="py-12 border-b border-gray-200/60">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs uppercase text-blue-600 font-bold tracking-widest mb-1">
                  Mua theo nhu cầu
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  Danh mục nổi bật
                </h2>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {topCategories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, category: cat._id }));
                    document
                      .getElementById("shop-section")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {/* Dùng 1 icon mạc định cho danh mục */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                  <p className="text-[10px] uppercase text-gray-400 mt-1">
                    {cat.productsCount || "Phổ biến"}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PHẦN SẢN PHẨM & BỘ LỌC CHÍNH */}
        <section id="shop-section" className="py-12 space-y-8">
          {/* Header của phần sản phẩm */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div>
              {keyword ? (
                <p className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">
                  Kết quả tìm kiếm
                </p>
              ) : (
                <p className="text-xs uppercase text-blue-600 font-bold tracking-widest mb-1">
                  Sản phẩm mới cập nhật
                </p>
              )}
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {keyword ? `Từ khóa “${keyword}”` : "Khám phá tất cả Laptop"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                {products.length} sản phẩm
              </span>
              {/* Lọc nhanh theo thương hiệu (Mang từ trên xuống đây cho gọn) */}
              <select
                name="brand"
                value={filter.brand}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                <option value="">Tất cả hãng</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
            {/* SIDEBAR BỘ LỌC */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 text-lg">Bộ lọc</h3>
                  <button
                    onClick={() =>
                      setFilter({
                        category: "",
                        brand: "",
                        minPrice: "",
                        maxPrice: "",
                      })
                    }
                    className="text-sm font-bold text-blue-600 hover:text-blue-800"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {/* Lọc Danh mục */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
                    Danh mục
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filter.category === ""}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                        Tất cả
                      </span>
                    </label>
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat._id}
                          checked={filter.category === cat._id}
                          onChange={handleFilterChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lọc Giá */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
                    Khoảng giá
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Từ (đ)
                      </span>
                      <input
                        type="number"
                        name="minPrice"
                        value={filter.minPrice}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Đến (đ)
                      </span>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filter.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Quảng Cáo Nhỏ */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-inner mt-8">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-200">
                    Mã giảm giá
                  </p>
                  <p className="text-lg font-bold leading-tight mb-2">
                    Giảm ngay 500K cho Tân Sinh Viên
                  </p>
                  <p className="text-xs text-blue-100/80">
                    Nhập mã:{" "}
                    <span className="font-mono bg-white/20 px-1 rounded">
                      SV500
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div>
              {loading ? (
                <div className="text-center py-32 bg-white rounded-3xl border border-gray-200 shadow-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500 font-medium">
                    Đang tìm kiếm laptop phù hợp nhất...
                  </p>
                </div>
              ) : products.length > 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
                  {/* GRID CHIA CỘT RESPONSIVE CHUẨN MỰC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {products.slice(0, visibleCount).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {visibleCount < products.length && (
                    <div className="text-center mt-12 mb-4">
                      <button
                        onClick={handleLoadMore}
                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all"
                      >
                        Xem thêm {products.length - visibleCount} sản phẩm nữa
                        <svg
                          className="w-5 h-5 animate-bounce"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-xl font-bold text-gray-700">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    Thử nới lỏng bộ lọc giá, hoặc đổi từ khóa tìm kiếm khác xem
                    sao nhé.
                  </p>
                  <button
                    onClick={() =>
                      setFilter({
                        category: "",
                        brand: "",
                        minPrice: "",
                        maxPrice: "",
                      })
                    }
                    className="mt-6 text-blue-600 font-bold hover:underline"
                  >
                    Xóa bộ lọc ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
